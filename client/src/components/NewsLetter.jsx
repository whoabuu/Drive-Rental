import React from 'react'
import{motion} from 'motion/react'

const NewsLetter = () => {
  return (
    <motion.div
    initial = {{ opacity: 0, y:30}}
    whileInView = {{opacity:1, y:0}}
    transition={{duration: 0.6,  ease:"easeOut"}}
    viewport={{once:true, amount:0.3}} 
     className="flex flex-col items-center w-full max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-black text-white">

      <div className="flex flex-col justify-center items-center text-center">

        <motion.h1
          initial = {{ opacity: 0, y:20}}
          whileInView = {{opacity:1, y:0}}
          transition={{duration: 0.5,  delay:0.2}}
          className="text-4xl md:text-[40px]">Need a Ride? We’ve Got You Covered!</motion.h1>

        <motion.p
        initial = {{ opacity: 0, y:20}}
        whileInView = {{opacity:1, y:0}}
        transition={{duration: 0.5,  delay:0.3}}
         className="text-sm md:text-base text-gray-500/90 mt-2 max-w-xl">Don’t miss out — get first access to offers, new arrivals, and exciting updates.</motion.p>
      </div>

      <motion.div 
       initial = {{ opacity: 0, y:20}}
       whileInView = {{opacity:1, y:0}}
       transition={{duration: 0.5,  delay:0.4}}
       className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">

        <input type="text" className="bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full" placeholder="Enter your email" />

        <button className="flex items-center justify-center gap-2 group bg-gray-700 hover:bg-gray-600 px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all">Subscribe
            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" /></svg>
        </button>

      </motion.div>

     <motion.p
      initial = {{ opacity: 0, y:20}}
      whileInView = {{opacity:1, y:0}}
      transition={{duration: 0.5,  delay:0.4}}
      className="text-gray-500 mt-6 text-xs text-center">Hop in! Get exclusive rental offers, updates, and road-trip inspiration every month.</motion.p>
    </motion.div>
  )
}

export default NewsLetter
