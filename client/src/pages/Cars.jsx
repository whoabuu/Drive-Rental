import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import CarCard from '../components/CarCard';
import { useSearchParams } from 'react-router-dom'; 
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast'; 
import{motion} from 'framer-motion'

const Cars = () => {
    const [searchParams] = useSearchParams();
    const pickupLocation = searchParams.get('pickupLocation');
    const pickupDate = searchParams.get('pickupDate');
    const returnDate = searchParams.get('returnDate');

    const { cars, axios } = useAppContext();
    const [input, setInput] = useState("");
    const [filteredCars, setFilteredCars] = useState([]);
    
    const isSearchData = pickupLocation && pickupDate && returnDate;

    const searchCarAvailability = async () => {
        try {
            const { data } = await axios.post('/api/bookings/check-availability',
                { location: pickupLocation, pickupDate, returnDate });

            if (data.success) {
                setFilteredCars(data.availableCars);
                if (data.availableCars.length === 0) {
                    toast.error('No cars available for the selected criteria.');
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    useEffect(() => {
      if (isSearchData) {
        searchCarAvailability();
      } else {
        setFilteredCars(cars);
      }
    }, [cars, pickupLocation, pickupDate, returnDate]); 

    const carsToDisplay = filteredCars.filter(car =>
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase()) ||
        car.transmission.toLowerCase().includes(input.toLowerCase())
    );
    

    return (
        <div>
            <motion.div 
             initial = {{ opacity: 0, y:30}}
             animate = {{opacity:1, y:0}}
             transition={{duration: 0.6 ,ease:"easeOut"}}
             className='flex flex-col items-center py-20 bg-gray-100 max-md:px-4'>
                <Title title="Available Cars" subTitle='Browse our collection of vehicles for your next adventure' />

                <motion.div
                  initial = {{ opacity: 0, y:20}}
                  animate = {{opacity:1, y:0}}
                  transition={{duration: 0.5, delay:0.3}}
                  className='flex items-center bg-white px-4 mt-6 max-w-lg w-full h-12 rounded-full shadow'>
                    <img src={assets.search_icon} alt="Search" className='w-4 h-4 mr-2' />
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder='Search by brand or model...'
                        className='w-full h-full outline-none text-gray-700'
                    />
                    {/* Filter icon can be used later to open a filter modal */}
                    <img src={assets.filter_icon} alt="Filter" className='w-4 h-4 ml-2 cursor-pointer' />
                </motion.div>
            </motion.div>

            <motion.div 
            initial = {{ opacity: 0}}
            animate = {{opacity:1}}
            transition={{duration: 0.5, delay:0.6}}
            className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
                <div className='xl:px-20 max-w-7xl mx-auto'>
                    <p className='text-gray-700'>Showing {carsToDisplay.length} of {filteredCars.length} Cars</p>

                   
                    {carsToDisplay.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4'>
                            {carsToDisplay.map((car) => (
                                <motion.div
                                initial = {{ opacity: 0, y:20}}
                                animate = {{opacity:1, y:0}}
                                transition={{duration: 0.4, delay: 0.1}} 
                                 key={car._id}> 
                                    <CarCard car={car} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-20'>
                            <p className='text-xl text-gray-600'>No cars match your search.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Cars;