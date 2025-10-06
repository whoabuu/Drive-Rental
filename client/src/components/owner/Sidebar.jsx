import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
 
    const {user, axios, fetchUser} = useAppContext();
    const location = useLocation();
    const [image, setImage] = useState('');

    const updateImage = async()=>{
        try {
          const formData = new FormData();
          formData.append('image', image);

          const {data} = await axios.patch('/api/owner/update-image', formData);
          if(data.success){
            fetchUser();
            toast.success(data.message);
            setImage('');
          }
          else{
            toast.error(data.message);
          }

        } catch (error) {
          toast.error(error.message);
        }
    }

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13
      md:max-w-60 w-full border-r border-gray-100 text-sm shadow-md'>

        <div className='group relative'>
            <label htmlFor="image">
                <img src={image ? URL.createObjectURL(image) : user?.image ||
                    "../user_profile.png"}  alt="" className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto'/>

                <input type="file" id="image" accept='image/*' hidden onChange={
                    e=>{setImage(e.target.files[0])}
                } />

                <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10
                 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
                    <img src={assets.edit_icon} alt="" />
                 </div>
            </label>
        </div>

        {image && (
            <button className='absolute top-0 right-0 flex p-2 gap-1 bg-black-900/10 text-gray-900 
             cursor-pointer rounded-lg m-2' onClick={updateImage}>
                Save <img src={assets.check_icon} width={13} />
            </button>
        )}
        <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>

        <div className='w-full'>
          {ownerMenuLinks.map((link, index)=>(
            <NavLink key={index} to={link.path} className={`relative flex items-center gap-2
              w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-gray-100 text-black' :
               'text-gray-700'}`}>
                <img src={link.path === location.pathname ? link.coloredIcon : link.icon} 
                 alt="car icon" className="w-6 h-6" />
                 <span className='max-md:hidden'>{link.name}</span>
                 <div className={`${link.path === location.pathname && 'bg-black'} w-1.5 h-8 rounded-l right-0 absolute`}></div>
            </NavLink>
          ))}
        </div>
       
    </div>
  )
}

export default Sidebar
