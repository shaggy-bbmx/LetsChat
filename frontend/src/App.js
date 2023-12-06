import React, { useContext } from "react"
import { Route } from 'react-router-dom'
import Chat from "./Components/Pages/Chat"
import Login from "./Components/Pages/Login"
import Register from "./Components/Pages/Register"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from 'react-bootstrap'
import NavBar from "./Components/NavBar/NavBar.js"
import { AuthContext } from "./Contexts/AuthContext"
import { ChatContextProvider } from "./Contexts/ChatContext"




function App() {

  const { user } = useContext(AuthContext)

  



  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Container className="text-secondary">
        <Route exact path='/'>
          {user ? <Chat /> : <Login />}
        </Route>
        <Route exact path='/login'>
          {user ? <Chat /> : <Login />}
        </Route>
        <Route exact path='/register'>
          {user ? <Chat /> : <Register />}
        </Route>
      </Container>
    </ChatContextProvider>
  )
}

export default App  
