import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';

const NavbarOwner = () => {

    const {user} = useAppContext();

  return (
    <div className={`flex justify-between items-center px-6 md:px-6 lg:px-24 xl:px-32 
         py-4 text-xl text-black-600 bg-[var(--color-primary)] border border-gray-300 
         relative transition-all shadow-md`}>
          <Link to="/">
             <img src={assets.logo} alt="logo" className='h-12 w-auto scale-200' />
          </Link>
      <p>Welcome, {user?.name || "Owner"}</p>
    </div>
  )
}

export default NavbarOwner
