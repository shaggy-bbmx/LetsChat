import React, { useContext } from 'react'
import { Stack } from 'react-bootstrap'
import { useFetchRecipients } from '../../hooks/useFetchRecipients'
import avatar from '../../Assets/avatar.svg'
import { ChatContext } from '../../Contexts/ChatContext'
import { unReadNotificationsFunc } from '../utils/unReadNotifications'
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage'
import moment from 'moment'


const UserChat = ({ chat, user }) => {

    const { recipientUser } = useFetchRecipients(chat, user)
    const { onlineUsers, notifications, userInboxClickHandler } = useContext(ChatContext)

    const unReadNotifications = unReadNotificationsFunc(notifications)

    const thisRecipientNotification = unReadNotifications?.filter((note) => {
        return note.senderId === recipientUser?._id
    })

    const isOnline = onlineUsers.some((user) => { return user?.userId === recipientUser?._id })

    const { latestMessage } = useFetchLatestMessage(chat)

    const trimText = (text) => {
        if (text.length < 20) return text
        else return text.substr(0, 20) + '......'
    }

    return (
        <Stack
            direction='horizontal'
            gap={3}
            className='user-card align-items-center p-2 justify-content-between'
            role='button'
            onClick={() => {
                if (thisRecipientNotification?.length > 0)
                    userInboxClickHandler(recipientUser, notifications)
            }}
        >
            <div className='d-flex'>
                <div className='me-2'>
                    <img src={recipientUser?.url ? recipientUser.url : avatar} height='40px'
                        style={{ 'border-radius': '50%' }} alt='avatar' />
                </div>
                <div className='text-content'>
                    <div className='name'> {recipientUser?.name}</div>
                    {latestMessage &&
                        <div className='text'>
                            <span>{trimText(latestMessage?.text)}</span>
                        </div>
                    }
                </div>
            </div>
            <div className='d-flex flex-column align-items-end '>
                {latestMessage &&
                    <div className='date'>
                        {moment(latestMessage?.createdAt).calendar()}
                    </div>
                }
                {thisRecipientNotification?.length > 0 &&
                    <div className='this-user-notifications'>
                        {thisRecipientNotification.length}
                    </div>
                }
                {(isOnline) && <span className='user-online'></span>}
            </div>
        </Stack>
    )
}

export default UserChat
