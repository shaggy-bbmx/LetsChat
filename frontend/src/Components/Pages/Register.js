import React from 'react'
import { Alert, Button, Form, Col, Row, Stack } from 'react-bootstrap'
import { useContext } from 'react'
import { AuthContext } from '../../Contexts/AuthContext'



const Register = () => {

  const { registerInfo, updateRegisterInfo, registerUser, isRegisterLoading, registerError } = useContext(AuthContext)

  const profilePicChangeHandler = (file, updateRegisterInfo, registerInfo) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (reader.readyState === 2) {
        updateRegisterInfo({ ...registerInfo, avatarPreview: reader.result, avatar: file })
      }
    }
  }


  return (
    <>
      <Form onSubmit={registerUser}>
        <Row style={{
          height: '100vh',
          justifyContent: 'center',
          paddingTop: '5%'

        }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>
              <Form.Control type='text'
                placeholder='Name'
                onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })} />
              <Form.Control type='text'
                placeholder='Email'
                onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })} />
              <Form.Control type='text'
                placeholder='Password'
                onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })} />
              <div className='profile-pic'>
                <img src={registerInfo.avatarPreview} alt='pic' 
                style={{ width: '180px', height: '200px' }} />
                <Form.Control type='file'
                  placeholder='Upload Photo'
                  style={{ width: '35%', position: 'relative', left: '200px', bottom: '50px' }}
                  onChange={(e) => profilePicChangeHandler(e.target.files[0], updateRegisterInfo, registerInfo)} />
              </div>
              <Button variant='primary' type='submit'>{isRegisterLoading ? '...' : 'Register'}</Button>
              {registerError?.error && <Alert variant='danger'>{registerError?.message}</Alert>}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Register
