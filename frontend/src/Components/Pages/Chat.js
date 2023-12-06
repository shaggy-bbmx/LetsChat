import React, { useContext } from 'react'
import { ChatContext } from '../../Contexts/ChatContext'
import { Container, Stack } from 'react-bootstrap'
import UserChat from '../UserChat/UserChat'
import { AuthContext } from '../../Contexts/AuthContext'
import PotentialChat from '../PotentialChat/PotentialChat'
import ChatBox from '../ChatBox/ChatBox'





const Chat = () => {


  const {
    userChats,
    isUserChatLoading,
    updateCurrentChat
  } = useContext(ChatContext)

  const { user } = useContext(AuthContext)


  return (
    <Container>
      <PotentialChat />
      {
        userChats?.length &&
        <>
          <Stack direction='horizontal' gap={4} className='align-items-start'>
            <Stack className='flex-grow-0 messages-box pe-3' gap={3}>
              {isUserChatLoading && <p>Loading ....</p>}
              {userChats?.map((chat, index) => {
                return (
                  <div key={index} onClick={() => { updateCurrentChat(chat) }}>
                    <UserChat chat={chat} user={user} />
                  </div>
                )
              }
              )}
            </Stack>
            <ChatBox />
          </Stack>
        </>
      }
    </Container>
  )
}

export default Chat
