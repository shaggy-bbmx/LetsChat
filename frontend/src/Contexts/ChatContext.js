import { createContext, useCallback, useEffect, useState } from "react"
import { baseUrl, getRequest, postRequest, deleteRequest } from "../Components/utils/services"
import { io } from 'socket.io-client'
import { useHistory } from "react-router-dom"





export const ChatContext = createContext()

export const ChatContextProvider = ({ children, user }) => {

    const history = useHistory()

    // STATES LIKE USERCHATROOM ,LOADINGCHATROOM, LOADING ERROR, POTENTIAL CHAT ROOMS
    const [userChats, setUserChats] = useState(null)
    const [isUserChatLoading, setIsUserChatLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potentialChat, setPotentialChat] = useState([])
    const [currentChat, setCurrentChat] = useState(null)


    //STATE RELATED TO LOADING MESSAGES  
    const [messages, setMessages] = useState(null)
    const [isMessageLoading, setMessageLoading] = useState(false)
    const [isMessageError, setMessageError] = useState(null)

    //STATE RELATED TO SENDING MESSAGES
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)




    //PUTTING SOKCET INSIDE HOOKS
    const [socket, setSocket] = useState(null)

    //HOOK TO CAPTURE ALL ONLINE USERS
    const [onlineUsers, setOnlineUsers] = useState([])

    //HOOK FOR NOTIFICATIONS
    const [notifications, setNotifications] = useState([])

    //HOOK FOR STORING ALL USERS
    const [allUsers, setAllUsers] = useState([])


    //FUNCTION MAINLY TO LOAD STRANGERS AS POTENTIAL FRIENDS
    useEffect(() => {
        const getUsers = async () => {
            const resp = await getRequest(`${baseUrl}/users`)

            //above getRequest is bound to happen so if any try to use false jwt token 
            //..then resp.error will come and will be redirected to login page
            if (resp.error) {
                console.log('local')
                localStorage.removeItem('User')
                history.push('/login')
                return
            }


            const pChats = resp?.filter((u) => {
                let isChatExist = false

                if (user?._id === u?._id) return false

                if (userChats) {
                    isChatExist = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    })
                }
                return (!isChatExist)
            })

            setPotentialChat(pChats)
        }

        setTimeout(getUsers, 1000)
    }, [userChats, onlineUsers])


    //FUCNTION TO LOAD FRIENDS
    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {

                setIsUserChatLoading(true)
                setUserChatsError(null)
                const resp = await getRequest(`${baseUrl}/chats/${user._id}`)
                setIsUserChatLoading(false)


                if (resp.error) {
                    return setUserChatsError(resp)
                }

                setUserChats(resp)

            }
        }

        getUserChats()

    }, [user, notifications])


    // FUCNTION TO ADD STARNGERS IN FRIENDS
    const createChat = useCallback(async (firstId, secondId) => {

        let body = JSON.stringify({ firstId, secondId })
        const resp = await postRequest(`${baseUrl}/chats`, body)
        if (resp.error) return

        setUserChats(prev => [...prev, resp])
    }, [])


    // FUNCTION TO DETERMINE WHICH IS THE CURRENT CHAT ROOM
    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    }, [])


    //FUNCTION TO LOAD ALL MESSAGES OF A GIVEN CHAT ROOM
    useEffect(() => {
        const getMessages = async () => {
            if (currentChat) {
                setMessageLoading(true)
                const resp = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
                setMessageLoading(false)

                if (resp.error) return setMessageError(resp)

                return setMessages(resp)

            }
        }

        getMessages()
    }, [currentChat])


    //FUNCTION TO SEND THE MESSAGE
    const sendTextMessage = useCallback(async (textMessage, user, currentChat, setTextMessage) => {
        if (!textMessage) return

        const body = JSON.stringify({
            chatId: currentChat?._id,
            senderId: user?._id,
            text: textMessage
        })

        const resp = await postRequest(`${baseUrl}/messages`, body)
        if (resp.error) {
            return setSendTextMessageError(resp)
        }

        setNewMessage(resp)
        setMessages(prev => [...prev, resp])
        setTextMessage('')

    }, [])


    //TO ESTABLISH SOCKET CONNECTION
    useEffect(() => {
        const newSocket = io('https://letschat-207o.onrender.com')
        // const newSocket = io('http://localhost:4000') 
        setSocket(newSocket)


        return () => {
            newSocket.disconnect()
        }
    }, [user])

    //SEND ONLINE INDICATION WHENEVER SOKCET CHANGES  AND ALSO TO CATCH MESSAGES  
    useEffect(() => {
        if (!socket) return

        socket.emit('addNewUser', user?._id)
        socket.on('getOnlineUsers', (data) => {
            console.log('front-getOnlineUsers', data)
            setOnlineUsers(data)
        })


    }, [socket, user])




    //SEND MESSAGE VIA SOCKET
    useEffect(() => {
        if (socket === null) return
        const recipientId = currentChat?.members.find(id => id !== user._id)

        socket.emit('sendMessage', { ...newMessage, recipientId })


        const sendNotification = async (user, recipientId) => {

            if (user && recipientId) {
                const note = {
                    senderId: user._id,
                    isRead: false,
                    date: new Date()
                }

                await postRequest(`${baseUrl}/notification/add/${recipientId}`, { notification: note })
            }
        }

        sendNotification(user, recipientId)

    }, [newMessage])



    //FUNCTION TO INTIAL LOAD NOTIFICATIONS FROM DB INTO THE  LOCAL STORAGE AND IN HOOK HOOK AT START
    useEffect(() => {

        const getUsersNotifications = async () => {
            const resp = await getRequest(`${baseUrl}/notification/${user?._id}`)
            if (resp.error) {
                return console.log('can"t load notifications')
            }

            localStorage['notifications'] = JSON.stringify(resp)
            setNotifications(JSON.parse(localStorage['notifications']))
        }

        getUsersNotifications()
    }, [user])



    //GET MESSAGE VIA SOCKET AND TO ADD NEW MESSAGE IN NOTIFICATION
    useEffect(() => {
        if (socket === null) return

        socket.on('getMessage', (message) => {
            if (currentChat?._id !== message?.chatId) return

            setMessages(prev => [...prev, message])
        })

        socket.on('getNotification', async (res) => {

            const isChatOpen = currentChat?.members.some((userId) => { return userId === res.senderId })
            let newObj
            if (isChatOpen) newObj = { ...res, isRead: true }
            else newObj = res


            if (localStorage['notifications']) {
                const cachedNotifications = JSON.parse(localStorage['notifications'])
                localStorage['notifications'] = JSON.stringify([newObj, ...cachedNotifications])
            } else {
                localStorage['notifications'] = JSON.stringify([newObj])
            }

            const allNotes = JSON.parse(localStorage['notifications'])
            setNotifications(allNotes)
            await postRequest(`${baseUrl}/notification/${user._id}`, { notifications: allNotes })
        })

        return () => {
            socket.off('getMessage')
            socket.off('getNotification')
            socket.off('getOnlineUsers')
        }

    }, [socket, currentChat])


    //FUNCTION TO FETCH ALL USERS
    useEffect(() => {

        const getAllUsers = async () => {

            if (user) {
                const resp = await getRequest(`${baseUrl}/users`)
                if (!resp.error) {
                    setAllUsers(resp)
                }
            }
        }

        getAllUsers()
    }, [user])




    //FUNCTION TO MARK ALL NOTIFICATIONS AS READ
    const markAllNotificationsAdRead = useCallback(async (notifications) => {
        setNotifications([])
        localStorage.removeItem('notifications')
        await postRequest(`${baseUrl}/notification/${user?._id}`, { notifications: [] })
    }, [user])


    //FUNCTION TO OPEN DESIRED CHATBOX WHEN CLICKED ON NOTIFICATION
    const notificationClickHandler = useCallback(async (n, userChats, notifications) => {

        const targetChatRoom = userChats.find((chat) => {
            return chat.members[0] === n.senderId || chat.members[1] === n.senderId
        })

        if (targetChatRoom) updateCurrentChat(targetChatRoom)


        // on click remove all notifcations from the sender 
        const mdNotifications = notifications.filter((note) => {
            if (note.senderId === n.senderId) {
                return false
            } else {
                return true
            }
        })

        localStorage['notifications'] = JSON.stringify(mdNotifications)
        setNotifications(mdNotifications)
        await postRequest(`${baseUrl}/notification/${user?._id}`, { notifications: mdNotifications })
    }, [user])


    //CLICK HANDLER WHEN USER CLICKS ON INBOX
    const userInboxClickHandler = useCallback(async (recipientUser, notifications) => {
        const mdNotifications = notifications?.filter((note) => {
            return note.senderId !== recipientUser._id
        }, [])

        setNotifications(mdNotifications)
        localStorage['notifications'] = JSON.stringify(mdNotifications)
        await postRequest(`${baseUrl}/notification/${user?._id}`, { notifications: mdNotifications })
    }, [user])

    //FUNCTION TO DELETE A MESSAGE FROM CHAT
    const deleteMessage = async (id) => {
        setMessages(prev => {
            return prev.filter((item) => {
                return item._id !== id
            })
        })

        await deleteRequest(`${baseUrl}/messages/delete/${id}`)
    }

    return (
        <ChatContext.Provider
            value={
                {
                    userChats,
                    isUserChatLoading,
                    userChatsError,
                    potentialChat,
                    currentChat,
                    createChat,
                    updateCurrentChat,
                    messages,
                    isMessageError,
                    isMessageLoading,
                    sendTextMessageError,
                    sendTextMessage,
                    onlineUsers,
                    notifications,
                    allUsers,
                    markAllNotificationsAdRead,
                    notificationClickHandler,
                    userInboxClickHandler,
                    deleteMessage
                }
            }
        >
            {children}
        </ChatContext.Provider>
    )
}