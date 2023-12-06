import React, { useContext } from 'react'
import { Navbar, Nav, Container, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../Contexts/AuthContext'
import Notifications from '../Notifications/Notifications'


const NavBar = () => {

    const { user, logoutUser } = useContext(AuthContext)


    return (
        <Navbar bg="dark" className="md-4" style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                    <Link to='/' className='link-light text-decoration-none'>ChatApp</Link>
                </h2>
                <span className="text-warning">{user ? `Welcome ,  ${user?.name}` : `Please login!!!`}</span>
                <Nav>
                    <Stack direction='horizontal' gap={3}>
                        {user ?
                            <>
                                <Notifications />
                                <Link
                                    onClick={() => { logoutUser() }}
                                    to='/login' className='link-light text-decoration-none'>
                                    Logout
                                </Link>

                            </>
                            :
                            <>
                                <Link to='/login' className='link-light text-decoration-none'>Login</Link>
                                <Link to='/register' className='link-light text-decoration-none'>Register</Link>
                            </>
                        }
                    </Stack>
                </Nav>
            </Container>

        </Navbar>

    )
}

export default NavBar
