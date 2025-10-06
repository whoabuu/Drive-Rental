import React from 'react'
import { assets } from '../assets/assets'
import{motion} from 'motion/react'

const Footer = () => {
  return (
    <motion.div 
    initial = {{ opacity: 0, y:30}}
    whileInView = {{opacity:1, y:0}}
    transition={{duration: 0.6}}
      className='text-black mt-60 px-6 md:px-16 lg:px-24 xl:px-32 text-sm'>

            <motion.div 
             initial = {{ opacity: 0, y:20}}
             whileInView = {{opacity:1, y:0}}
             transition={{duration: 0.6,  delay:0.2}}
             className='flex flex-wrap justify-between item-start gap-8 pb-6
             border-borderColor '>
                <div>
                    <motion.img 
                     initial = {{ opacity: 0}}
                     whileInView = {{opacity:1}}
                     transition={{duration: 0.5,  delay:0.3}} 
                     src={assets.logo} alt="logo" className='h-[120px] w-[240px]' />
                    <motion.p
                     initial = {{ opacity: 0}}
                     whileInView = {{opacity:1}}
                     transition={{duration: 0.5,  delay:0.4}}
                      className='max-w-80 mt-3'>
                    Premium car rental service with a wide selection of luxury and everyday 
                    vehicles for all your driving needs.                    
                    </motion.p>
                    <motion.div
                      initial = {{ opacity: 0}}
                      whileInView = {{opacity:1}}
                      transition={{duration: 0.5,  delay:0.5}}
                      className='flex items-center gap-3 mt-4'>
                        <a href="#"><img src={assets.facebook_logo} alt="" className='w-5 h-5' /></a>
                        <a href="#"><img src={assets.instagram_logo} alt="" className='w-5 h-5' /></a>
                        <a href="#"><img src={assets.twitter_logo} alt="" className='w-5 h-5' /></a>
                        <a href="#"><img src={assets.gmail_logo} alt="" className='w-5 h-5' /></a>

                    </motion.div>
                </div>

                <motion.div
                 initial = {{ opacity: 0, y:20}}
                 whileInView = {{opacity:1, y:0}}
                 transition={{duration: 0.6,  delay:0.4}}
                 className='flex flex-wrap justify-between gap-8 w-1/2'>
                <div>
                    <h2 className='text-base font-medium text-black uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5 '>
                        <li><a href="/">Home</a></li>
                        <li><a href="/cars">Browse Cars</a></li>
                        <li><a href="/owner/add-car">List Your Cars</a></li>
                        <li><a href="/about-us">About Us</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-black uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5 '>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms Of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-black uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5 '>
                        <li>Phase 1</li>
                        <li>Hinjewadi, Pune 411057</li>
                        <li>+91 9511788736</li>
                        <li>driverenatl@gmail.com</li>
                    </ul>
                </div>
                </motion.div>
            </motion.div>

            <hr className='border-black mt-8' />
            <motion.div 
             initial = {{ opacity: 0, y:10}}
             whileInView = {{opacity:1, y:0}}
             transition={{duration: 0.6,  delay:0.6}}
             className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} <a href="https://prebuiltui.com">Drive Rental</a>. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li> <span> | </span>
                    <li><a href="#">Terms</a></li> <span> | </span>
                    <li><a href="#">Cookies</a></li>
                </ul>
            </motion.div>
        </motion.div>
  )
}

export default Footer
