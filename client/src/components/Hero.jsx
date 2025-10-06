import React, { useState } from 'react';
import { assets, cityList } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import{motion} from 'motion/react'

const Hero = () => {
    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();
    const [pickupLocation, setPickupLocation] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();

        if (pickupLocation && pickupDate && returnDate) {
            navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
        } else {
            toast.error("Please fill in all search fields.");
        }
    };

    return (
        <motion.div 
        initial = {{ opacity: 0}}
        animate = {{opacity:1}}
        transition={{duration: 0.8}}
        className="h-screen flex flex-col justify-center items-center gap-14 bg-gray-100 text-center px-4">
            <motion.h1 initial = {{y: 50, opacity: 0}}
                animate = {{y: 0, opacity:1}}
                transition={{duration: 0.6, delay:0.2}}
                className="text-4xl md:text-5xl font-semibold">
                  Rent Your Perfect Ride
            </motion.h1>

            {/* 4. Use the form's onSubmit handler */}
            <motion.form 
            initial = {{scale:0.95, y: 50, opacity: 0}}
            animate = {{scale:1, y: 0, opacity:1}}
            transition={{duration: 0.6, delay:0.4}}
            onSubmit={handleSearch} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl w-full max-w-4xl bg-white shadow-lg gap-6 md:gap-10">
                <div className="flex flex-col gap-2 w-full">
                    <label className="font-medium">Pickup Location</label>
                    <select
                        required
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
                    >
                        <option value="">Please select location</option>
                        {cityList.map((city) => (
                            <option value={city} key={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="pickup-date" className="font-medium">Pick-up date</label>
                    <input
                        type="date"
                        id="pickup-date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="return-date" className="font-medium">Return date</label>
                    <input
                        type="date"
                        id="return-date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        // 5. Dynamically set the min date to prevent invalid selections
                        min={pickupDate}
                        disabled={!pickupDate} // Disable until a pickup date is chosen
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 disabled:bg-gray-100"
                        required
                    />
                </div>

                <motion.button
                   whileHover={{scale:1.05}}
                   whileTap={{scale:0.95}}
                    type="submit"
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition">
                    <img src={assets.search_icon} alt="search" className="w-4 h-4 invert" />
                    Search
                </motion.button>
            </motion.form>

            <motion.img
              initial = {{y: 100, opacity: 0}}
              animate = {{y: 0, opacity:1}}
              transition={{duration: 0.5, delay:0.6}}
              src={assets.main_car} alt="car" className="max-h-80 object-contain" />
        </motion.div>
    );
};

export default Hero;