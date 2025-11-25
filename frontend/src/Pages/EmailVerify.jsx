import React, { useContext, useEffect } from "react";
import auth from "../assets/auth.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const EmailVerify = () => { 

  const navigate = useNavigate();

   

  const {userData, isLoggedin, backendurl, getUserData } = useContext(AppContext)

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

  const onSubmitHendler = async (e) =>{
    try {
      e.preventDefault();
      
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      axios.defaults.withCredentials = true; 

      const {data} = await axios.post(backendurl + '/api/auth/verify-email', {otp})

      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedin, userData])

  return (
    <>
      <div className=" flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-sky-300 to-gray-900">
        <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-white text-sm">
          <img
            onClick={() => navigate("/")}
            src={auth}
            alt=""
            className="w-30 h-30 m-auto rounded-full fill-white drop-shadow-xl/80 cursor-pointer"
          />

          <form
            onSubmit={onSubmitHendler}
            action=""
            className="bg-transparent p-8 rounded-lg  w-full  text-sm"
          >
            <h1 className="text-white text-2xl front-semibold text-center mb-4">
              Email Verify OTP
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
        </div>
      </div>
    </>
  );
};

export default EmailVerify;
