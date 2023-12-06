import React, { useContext } from 'react'
import { ChatContext } from '../../Contexts/ChatContext'
import { AuthContext } from '../../Contexts/AuthContext'

const PotentialChat = () => {

    const { user } = useContext(AuthContext)
    const { potentialChat, createChat } = useContext(ChatContext)
    const { onlineUsers } = useContext(ChatContext)


    return (
        <div className='all-users'>
            {potentialChat && potentialChat.map((u, index) => {
                return (
                    <div className='single-user' key={index} onClick={() => { createChat(user._id, u._id) }}>
                        {u.name}
                        <span
                            className={(onlineUsers?.some((user) => user?.userId === u?._id)) ? 'user-online' : ''}>
                        </span>
                        {}
                    </div>
                )
            }
            )}
        </div >
    )
}

export default PotentialChat
