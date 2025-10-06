import React, { useEffect } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/appContext'

const Layout = () => {
  const{isOwner, navigate} = useAppContext();

  useEffect(()=>{
    if(!isOwner){
      navigate('/');
    }
  }, [isOwner])
  return (
    <div className='flex flex-col'>
      <NavbarOwner/>
      <div className='flex'>
        <Sidebar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
