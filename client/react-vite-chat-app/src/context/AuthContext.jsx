import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/service";
import { Bounce, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const success = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
}
const failed = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
}

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [ user, setUser ] = useState(null)
    const [ registerError, setRegisterError ] = useState(null);
    const [ isRegisterLoading, setIsRegisterLoading ] = useState(false);
    const [ registerInfo, setRegisterInfo ] = useState({
        name: "",
        email: "",
        password: "",
    });


    const [ loginError, setLoginError ] = useState(null);
    const [ isLoginLoading, setIsLoginLoading ] = useState(false);
    const [ loginInfo, setLoginInfo ] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const user = localStorage.getItem("User")

        setUser(JSON.parse(user));
    }, 
    [])

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])

    const registerUser = useCallback( async(e) => {
        e.preventDefault();

        setIsRegisterLoading(true)
        setRegisterError(null)
        const response = await postRequest(`${baseUrl}/register`, JSON.stringify(registerInfo));

        setIsRegisterLoading(false)

        if(response.error) {
            failed("Register Failed")
            return setRegisterError(response);
        }
        success("Register Successfull")
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    }, [registerInfo]);

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
    }, [])

    const loginUser = useCallback( async(e) => {
        e.preventDefault();
        setIsLoginLoading(true)
        setLoginError(null)
        const response = await postRequest(`${baseUrl}/login`, JSON.stringify(loginInfo))
        setIsLoginLoading(false)
        if(response.error) {
            failed("Login Failed")
            return setLoginError(response)
        }
        success("Login Successfull")
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    }, [loginInfo]);

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    });


    return <AuthContext.Provider value={{ 
        user, 
        registerInfo, 
        updateRegisterInfo, 
        registerUser, 
        registerError, 
        isRegisterLoading, 
        logoutUser,
        loginUser,
        loginInfo,
        loginError,
        updateLoginInfo,
        isLoginLoading }}>

        {children}
    </AuthContext.Provider>
}