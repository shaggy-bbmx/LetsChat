import React, { useContext } from 'react'
import { Alert, Button, Form, Col, Row, Stack } from 'react-bootstrap'
import { AuthContext } from '../../Contexts/AuthContext'



const Login = () => {

  const { loginInfo, loginError, isLoginLoading, updateLoginInfo, loginUser } = useContext(AuthContext)





  return (
    <>
      <Form onSubmit={loginUser}>
        <Row style={{
          height: '100vh',
          justifyContent: 'center',
          paddingTop: '5%'

        }}
        >
          <Col xs={6}>
            <Stack gap={3}>

              <h2>  Login</h2>

              <Form.Control type='text' placeholder='Email'
                onChange={(e) => { updateLoginInfo({ ...loginInfo, email: e.target.value }) }} />
              <Form.Control type='text' placeholder='Password'
                onChange={(e) => { updateLoginInfo({ ...loginInfo, password: e.target.value }) }} />

              <Button variant='primary' type='submit'
                disabled={isLoginLoading ? true : false}
              >
                {isLoginLoading ? '...' : 'Login'}
              </Button>

              {loginError?.error && <Alert variant='danger'>{loginError?.message}</Alert>}

            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Login
