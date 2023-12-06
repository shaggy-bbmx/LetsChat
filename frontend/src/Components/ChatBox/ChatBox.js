import React, { useContext, useState, useRef, useEffect } from 'react'
import { ChatContext } from '../../Contexts/ChatContext'
import { AuthContext } from '../../Contexts/AuthContext'
import { useFetchRecipients } from '../../hooks/useFetchRecipients'
import { Stack } from 'react-bootstrap'
import moment from 'moment'
import InputEmoji from 'react-input-emoji'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'




const ChatBox = () => {

    const { user } = useContext(AuthContext)
    const { messages, currentChat, isMessageLoading, sendTextMessage, deleteMessage } = useContext(ChatContext)
    const { recipientUser } = useFetchRecipients(currentChat, user)
    const [textMessage, setTextMessage] = useState('')
    const bottomRef = useRef(null)
    const [selection, setSelection] = useState(false)
    const [indexSelected, setIndexSelected] = useState(null)





    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView(true);
    }, [messages])


    if (!recipientUser) return (
        <p style={{ textAlign: 'center', width: '100%' }}>
            No conversations selected yet...
        </p>
    )

    if (isMessageLoading) {
        return (
            <p style={{ textAlign: 'center', width: '100%' }}>
                Please wait ....
            </p>
        )
    }




    return (
        <Stack gap={4} className='chat-box'>
            <div className='chat-header'>
                <strong>{(recipientUser.name).toUpperCase()}</strong>
            </div>
            <Stack gap={3} className='messages'>
                {messages && messages.map((message, index) => {
                    if (message?.senderId === user?._id) {
                        return (
                            <Stack direction='horizontal' gap={3} className='align-self-end flex-grow-0 message-tab'>

                                <FontAwesomeIcon
                                    className='delete-icon'
                                    icon={faTrash} beatFade
                                    style={selection && indexSelected === index ? {} : { display: 'none' }}
                                    onClick={() => deleteMessage(message?._id)}
                                />

                                <Stack key={index}
                                    className={selection && indexSelected === index ?
                                        'message  make-red' : 'message self'}
                                    onClick={() => {
                                        if (selection && indexSelected !== index) {
                                            setIndexSelected(index)
                                        } else {
                                            if (selection) setIndexSelected(null)
                                            else setIndexSelected(index)
                                            setSelection(p => !p)
                                        }
                                    }}>
                                    <span>{message.text}</span>
                                    <span className='message-footer'>
                                        {moment(message.createdAt).calendar()}
                                    </span>
                                </Stack>

                            </Stack>
                        )
                    } else {
                        return (
                            <Stack direction='horizontal' gap={3} className='align-self-start flex-grow-0'>

                                <Stack key={index}
                                    className={selection && indexSelected === index ?
                                        'message  make-red' : 'message'} onClick={() => {
                                            if (selection && indexSelected !== index) {
                                                setIndexSelected(index)
                                            } else {
                                                if (selection) setIndexSelected(null)
                                                else setIndexSelected(index)
                                                setSelection(p => !p)
                                            }
                                        }}>
                                    <span>{message.text}</span>
                                    <span className='message-footer'>
                                        {moment(message.createdAt).calendar()}
                                    </span>
                                </Stack>

                                <FontAwesomeIcon
                                    className='delete-icon'
                                    icon={faTrash} beatFade
                                    style={selection && indexSelected === index ? {} : { display: 'none' }}
                                    onClick={() => deleteMessage(message?._id)}
                                />

                            </Stack>
                        )
                    }

                }

                )}
                <div ref={bottomRef} />
            </Stack>
            <Stack direction='horizontal' gap={3} className='chat-input flex-grow-0'>
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    fontFamily='nunito' borderColor='rgba(72,112,223,0.2)'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter')
                            sendTextMessage(textMessage, user, currentChat, setTextMessage)
                    }}
                />
                <button className='send-btn'
                    onClick={(e) => sendTextMessage(textMessage, user, currentChat, setTextMessage)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                    </svg>
                </button>
            </Stack>
        </Stack >
    )
}

export default ChatBox
