import React, { useContext, useState } from "react";
import auth from "../assets/auth.png";
import {  useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";


const ResetPassword = () => {

  const {backendurl} = useContext(AppContext)
  
 
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)


      const inputRefs = React.useRef([])
    
      const handleInput = (e, index)=>{
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
          inputRefs.current[index + 1].focus();
        }
      }
    
      const handleKeyDown = (e, index) =>{
        if(e.key === 'Backspace' && e.target.value === '' && index > 0){
          inputRefs.current[index - 1].focus();
        }
      }
    
      const handlePaste = (e)=>{
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
          if(inputRefs.current[index]){
            inputRefs.current[index].value = char
          }
        });
      }

      const onSubmitEmail = async (e)=>{
        axios.defaults.withCredentials = true;
        e.preventDefault();
        try {
          const {data} = await axios.post(backendurl + 'api/auth/send-reset-otp', { email})
          data.success ? toast.success(data.message) : toast.error(data.message)
          data.success  && setIsEmailSent(true)
        } catch (error) {
          toast.error(error.message)
        }
      }

      const onSubmitOTP = async (e)=>{
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value)
        setOtp(otpArray.join(''))
        setIsOtpSubmited(true)
      }


      const onSubmitNewPassword = async (e)=>{
        e.preventDefault();
        try {
          const {data} = await axios.post(backendurl + 'api/auth/reset-pass', {email, otp, newPassword})
          data.success ? toast.success(data.message) : toast.error(data.message)
          data.success && navigate('/login')
        } catch (error) {
          toast.error(error.message)
        }
      }

  return (
    <>
      <div className=' flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-sky-300 to-gray-900'>
        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-white text-sm'>
          <img onClick={()=>navigate('/')} src={auth} alt=""  className='w-30 h-30 m-auto rounded-full fill-white drop-shadow-xl/80 cursor-pointer'/>
          
{!isEmailSent && 
          <form action="" onSubmit={onSubmitEmail} >
            <h1 className="text-white text-2xl front-semibold text-center mb-5 mt-5">
              Reset Your Password
            </h1>
            
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full  fill-white drop-shadow-xl/80 bg-gray-700'> 
              <p>📩</p>
              <input onChange={e => setEmail(e.target.value)}  value={email} className='bg-transparent outline-none ' type="email"  placeholder='Enter Full email' required/>
            </div>

              <button className='w-full py-2.5 cursor-pointer rounded-full fill-white drop-shadow-xl/80 bg-gradient-to-br from-sky-300 to-gray-900 font-medium mt-5' >Submit</button>

          </form>

          }

{!isOtpSubmited && isEmailSent && 
          <form
            onSubmit={onSubmitOTP}
            action=""
            className="bg-transparent p-8 rounded-lg  w-full  text-sm"
          >
            <h1 className="text-white text-2xl front-semibold text-center mb-4">
              Reset Password OTP
            </h1>
            <p className="text-center mb-6 text-white">
              Enter your 6-digit ****** code 
            </p>

            <div className="flex justify-center items-center mb-8 " onPaste={handlePaste}>
              {
                Array(6).fill(0).map((_, index)=>(
                  <input type="text" maxLength='1' required key={index} className=" w-12 sm:w-10 sm:h-12 m-1 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none "
                  ref={e => inputRefs.current[index] = e }
                  onInput={(e)=> handleInput(e, index)}
                  onKeyDown={(e)=>handleKeyDown(e, index)}
                  />
                ))
}
            </div>

            <button className='w-full py-2.5 cursor-pointer rounded-full fill-white drop-shadow-xl/80 bg-gradient-to-br from-sky-300 to-gray-900 font-medium'>Verify Email</button>

          </form>
}

{isOtpSubmited && isEmailSent && 
          <form action="" onSubmit={onSubmitNewPassword}>
            <h1 className="text-white text-2xl front-semibold text-center mb-5 mt-5">
              New Password
            </h1>

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full  fill-white drop-shadow-xl/80 bg-gray-700'> 
              <p>🔏</p>
              <input onChange={e => setNewPassword(e.target.value)}  value={newPassword} className='bg-transparent outline-none ' type="password"  placeholder='Password' required/>
            </div>

              <button className='w-full py-2.5 cursor-pointer rounded-full fill-white drop-shadow-xl/80 bg-gradient-to-br from-sky-300 to-gray-900 font-medium mt-7' onClick={()=>navigate('/login')}>Submit</button>

          </form>
}
        </div>
      </div>
    </>
  )
}

export default ResetPassword
