import React from 'react'
import NavBar from '../Components/Navebar/NavBar'
import { Outlet } from 'react-router-dom'

  import { ToastContainer} from 'react-toastify';


const AppLayout = () => {
  return (
    <>
    
      <div >
        <NavBar/>

        <Outlet/>
      <ToastContainer  />
      </div>
    </>
  )
}

export default AppLayout
