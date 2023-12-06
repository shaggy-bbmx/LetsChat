import { createContext, useCallback, useEffect, useState } from "react"
import { baseUrl, postRequest, multiPartPostRequest } from "../Components/utils/services"
import avatar from '../Assets/avatar.svg'




export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    //STATES LIKE USER,ERROR,LOADING,REGISTER-FIELDS    
    const [user, setUser] = useState(null)
    const [registerError, setRegisterError] = useState(null)
    const [isRegisterLoading, setRegisterLoading] = useState(false)
    const [registerInfo, setRegisterInfo] = useState({
        name: "", email: "", password: "",
        avatarPreview: avatar, avatar: ""
    })
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "" })
    const [loginError, setLoginError] = useState(null)
    const [isLoginLoading, setLoginLoading] = useState(false)


    //FUNCTION TO UPDATE REGISTER FIELDS
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)

    }, [])

    //FUNCTION TO UPDATE LOGIN FIELDS
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)

    }, [])


    //FUCNTION TO REGISTER USER
    const registerUser = useCallback(async (e) => {
        e.preventDefault()
        setRegisterLoading(true)
        setRegisterError(null)

        const myForm = new FormData()
        myForm.append('image', registerInfo.avatar)

        const resp = await postRequest(`${baseUrl}/users/register`,
            { name: registerInfo.name, email: registerInfo.email, password: registerInfo.password })

        myForm.append('email', resp.email)
        const uploadResponse = await multiPartPostRequest(`${baseUrl}/users/uploadPic`, myForm)
        console.log('UR', uploadResponse)
        setRegisterLoading(false)

        if (resp.error) {
            return setRegisterError(resp)
        }

        localStorage['User'] = JSON.stringify(resp)
        setUser(resp)

    }, [registerInfo])




    //FUCNTION TO LOGIN USER
    const loginUser = useCallback(async (e) => {
        e.preventDefault()
        setLoginLoading(true)
        setLoginError(null)


        const resp = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo))
        setLoginLoading(false)

        if (resp.error) {
            return setLoginError(resp)
        }

        localStorage['User'] = JSON.stringify(resp)
        setUser(resp)

    }, [loginInfo])


    //LOGOUT USER
    const logoutUser = useCallback(() => {
        localStorage.removeItem('User')
        setUser(null)
    }, [])

    //Useffect To Load Current User at the intial 
    useEffect(() => {
        const user = localStorage['User']
        if (user) setUser(JSON.parse(user))
    }, [])


    return (
        <AuthContext.Provider value={
            {
                user,
                registerInfo,
                registerError,
                isRegisterLoading,
                updateRegisterInfo,
                registerUser,
                loginInfo,
                loginError,
                isLoginLoading,
                updateLoginInfo,
                loginUser,
                logoutUser
            }
        }
        >
            {children}
        </AuthContext.Provider >
    )
}