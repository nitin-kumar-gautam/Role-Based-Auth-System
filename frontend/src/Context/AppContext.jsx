import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

axios.defaults.withCredentials = true;

export const AppContextProvider = (props)=>{

    const backendurl = import.meta.env.VITE_BACKEND_URL;

    // console.log("BACKEND URL = ", backendurl);

     const [isLoggedin, setLoggedin] = useState(false)
     const [userData, setUserData] = useState(false)


     const getAuthState = async ()=>{
        try {
            
             const {data} = await axios.post(backendurl + '/api/auth/user-authorised')
             if(data.success){
                setLoggedin(true)
                getUserData()
             }
        } catch (error) {
            toast.error(error.message)
        }
     }

     const getUserData = async ()=>{
        try {
            axios.defaults.withCredentials = true;
           
           
            const {data} = await axios.get(backendurl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
     }

    useEffect(()=>{
         const token = document?.cookie.token;
          console.log(token)
        // getAuthState();
    },[])

    const value = {
        backendurl,
        isLoggedin, setLoggedin,
        userData, setUserData,
        getUserData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}