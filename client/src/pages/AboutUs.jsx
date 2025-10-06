import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, 
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

const AboutUs = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* 1. Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center text-white text-center px-4">
                {/* Background Image */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <img 
                    src={assets.scenic_road} // Replace with your own high-quality image
                    alt="Scenic road" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <h1 className="text-4xl md:text-6xl font-bold">More Than a Rental.</h1>
                    <h1 className="text-4xl md:text-6xl font-bold mt-2">It's the Freedom to Explore.</h1>
                    <p className="mt-4 max-w-2xl mx-auto">
                        At DriveRental, we believe getting the perfect car should be as seamless and enjoyable as the journey itself.
                    </p>
                </motion.div>
            </div>

            {/* Main content with staggered animations */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="px-6 md:px-16 lg:px-24 xl:px-32 py-20 max-w-5xl mx-auto flex flex-col gap-20"
            >
                {/* 2. Our Story Section */}
                <motion.div variants={itemVariants} className="text-center flex flex-col items-center">
                    <h2 className="text-3xl font-semibold mb-4">Born from a Frustrating Search for the Perfect Ride.</h2>
                    <p className="text-gray-600 max-w-3xl">
                        Founded in Nashik, DriveRental was created by car enthusiasts passionate about travel. We envisioned a platform where owners could safely monetize their vehicles and renters could find the perfect ride for any adventure, hassle-free. We're not just a company; we're a community dedicated to making travel more accessible for everyone.
                    </p>
                </motion.div>

                {/* 3. Our Values Section */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-3xl font-semibold text-center mb-10">Our Commitments to You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-3">🛡️</span>
                            <h3 className="text-xl font-semibold mb-2">Safety First</h3>
                            <p className="text-gray-600">Your security is our priority. Every vehicle is inspected, insured, and every driver is verified, ensuring peace of mind on every trip.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-3">💎</span>
                            <h3 className="text-xl font-semibold mb-2">Total Transparency</h3>
                            <p className="text-gray-600">No hidden fees. No surprises. We believe in clear, upfront pricing so you know exactly what you're paying for before you book.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-3">🤝</span>
                            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
                            <p className="text-gray-600">We're building a trusted community of car owners and renters. By connecting people, we foster shared experiences and enable new adventures.</p>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Call to Action Section */}
                <motion.div variants={itemVariants} className="text-center bg-gray-100 p-10 rounded-lg">
                    <h2 className="text-3xl font-semibold mb-4">Ready to Start Your Next Adventure?</h2>
                    <div className="flex justify-center gap-4 mt-6">
                        <Link to="/cars" className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition">
                            Browse Cars
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default AboutUs;