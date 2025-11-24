import React, { useContext } from 'react'
import auth from '../../assets/auth.png'
import {useNavigate} from 'react-router-dom'
import { AppContext } from '../../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const NavBar = () => {
  const navigate = useNavigate()
  const {userData, setLoggedin, backendurl, setUserData } = useContext(AppContext)

  const sendVerificationOtp = async ()=>{
    try {
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendurl + 'api/auth/send-verify-otp')
        
        if(data.success){
          toast.success(data.message)
          navigate('/email-verify')
        }else{
          toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async ()=>{
    try {
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendurl + 'api/auth/logout')
        data.success && setLoggedin(false)
        data.success && setUserData(false)
        toast.success(data.message)
        navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className='w-full flex justify-between items-center p-3 sm:p-4 sm:px-24 absolute top-0  h-20'>
        <img onClick={()=>navigate('/')} src={auth} alt="" className='w-13 sm:w-15 cursor-pointer'/>

        {userData ? 
          <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>
            {userData.username[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-white  rounded pt-10'>
              <ul className='list-none m-0 p-2  bg-gray-800 text-sm rounded'>
                {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 hover:text-black hover:bg-gray-200 cursor-pointer'>Verify Email</li>}
                
                <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer hover:text-black pr-10' onClick={logout}>Logout</li>
              </ul>
            </div>
          </div> 
          : <button onClick={()=>navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-600 transition-all cursor-pointer hover:text-white'>Login</button>
       
      }
        </div>
    </>
  )
}

export default NavBar
