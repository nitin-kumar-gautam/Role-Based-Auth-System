import React, { useContext, useState } from 'react'
import auth from '../assets/auth.png'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const navigate = useNavigate()

  const {backendurl, setLoggedin, getUserData} = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHendler = async (e)=>{
    try {
      e.preventDefault()

      axios.defaults.withCredentials = true

      if(state === 'Sign Up'){
        const {data} = await axios.post(backendurl + '/api/auth/register', {username: name, email, password}) 
        
        if(data.success){
          setLoggedin(true)
          toast.success(data.message)
          navigate('/login')
        }else{
          toast.error(data.message)
        }
      }else{
        const {data} = await axios.post(backendurl + '/api/auth/login', { email, password}) 
        
        if(data.success){
          setLoggedin(true)
          toast.success(data.message)
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)
        }
      }
    }catch(error){
      toast.error(error?.response?.data?.message)
    }
  }


  return (
    <>
      <div className=' flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-sky-300 to-gray-900'>
        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-white text-sm'>
          <img onClick={()=>navigate('/')} src={auth} alt=""  className='w-30 h-30 m-auto rounded-full fill-white drop-shadow-xl/80 cursor-pointer'/>
          <h2 className='text-3xl mt-5 font-semibold text-white text-center mb-3'>
            {state === 'Sign Up' ? 'Sign Up' : 'Login '}
          </h2 >
          <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your Account' : 'Login your Account'}</p>

          <form action="" onSubmit={onSubmitHendler}>
            {state === 'Sign Up' && (
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full  fill-white drop-shadow-xl/80 bg-gray-700'> 
              <p>🙎</p>
              <input onChange={e => setName(e.target.value)}  value={name} className='bg-transparent outline-none ' type="text"  placeholder='Enter Full Name' required/>
            </div>
            )}
            

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full fill-white drop-shadow-xl/80  bg-gray-700'>
              <p>📩</p> 
              <input onChange={e => setEmail(e.target.value)}  value={email} className='bg-transparent outline-none ' type="email"  placeholder='Enter Email' required/>
            </div>

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full  fill-white drop-shadow-xl/80 bg-gray-700'> 
              <p>🔏</p>
              <input onChange={e => setPassword(e.target.value)}  value={password} className='bg-transparent outline-none ' type="password"  placeholder='Password' required/>
            </div>

            <p onClick={()=>navigate('/reset-password')} className='mb-4 text-indigo-400 cursor-pointer'>Forgot Password</p>

            <button className='w-full py-2.5 cursor-pointer rounded-full fill-white drop-shadow-xl/80 bg-gradient-to-br from-sky-300 to-gray-900 font-medium'>{state}</button>

            {state === 'Sign Up' ? (
              <p className='text-white text-center text-xs mt-4'>Already have an account -- <span onClick={()=> setState('login')} className='text-indigo-400 cursor-pointer underline'>  Login </span></p>
            ) : (
              <p className='text-white text-center text-xs mt-4'>Don't have an account -- <span onClick={()=> setState('Sign Up')} className='text-indigo-400 cursor-pointer underline'>Sign Up</span></p>
            )}
            
            
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
