import React, { useContext } from 'react'
import auth from '../../assets/auth.png'
import { AppContext } from '../../Context/AppContext'

const Header = () => {

  const {userData} = useContext(AppContext)

  return (
    <>
      <div className='flex flex-col items-cenetr mt-30  px-4 text-center text-gray-800'>
        <div className='m-auto sm:ml-65 md:ml-160'>
            <img src={auth} alt="" className='w-40 sm:w-50 sm:h-50 h-40 mb-6 sm:ml-3 fill-white drop-shadow-xl/80 cursor-pointer'/>
        <h1 className='flex items-center m-3  sm:mb-3 text-xl sm:text-3xl font-medium'>Hey {userData ? userData.username : 'Developer '}👋</h1>
        </div>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to Our Auth App</h2>
        <p className='mb-8 max-w-md sm:m-auto sm:mb-4'>Let's start with a quick product tour and we will have you up and running in to time!</p>
        <button className='md:w-56 md:m-auto sm:w-56 sm:m-auto border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-800 hover:text-white transition-all'>Get Started</button>
      </div>
    </>
  )
}

export default Header
