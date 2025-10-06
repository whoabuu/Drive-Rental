import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import{motion} from 'motion/react'

const Banner = () => {
  return (
    <motion.div 
    initial = {{ opacity: 0, y:50}}
    whileInView = {{opacity:1, y:0}}
    transition={{duration: 0.6}}
     className='flex flex-col md:flex-row md:items-start items-center justify-between
     px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-black to-gray-400 max-w-6xl mx-3 md:mx-auto rounded-2xl
     overflow-hidden'>

      <div className='text-white'>
        <h2 className='text-3xl font-medium'>Do You Own A Luxury Car?</h2>
        <p className='mt-2'>Monetize your vehicle effortlessly by listing it on DriveRental.</p>
        <p className='max-w-130'>We take care of insurance, driver verification and secure payments
           so you can earn passive income, stress free.
        </p>

        <Link to={"/owner/add-car"}>
        <motion.button 
         whileHover={{scale:1.05}}
         whileTap={{scale:0.95}} 
         className='px-6 py-2 bg-gray-700 hover:bg-gray-600 transition-all 
         text-white rounded-lg text-sm mt-4 cursor-pointer'>
          List your car
         </motion.button></Link>
      </div>
      
      <motion.img
       initial = {{ opacity: 0, x:50}}
       whileInView = {{opacity:1, x:0}}
       transition={{duration: 0.6, delay:0.4}}
       src={assets.banner_car_image} alt="car" className='max-h-45 mt-10'/>
    </motion.div>
  )
}

export default Banner
