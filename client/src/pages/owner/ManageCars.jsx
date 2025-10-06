import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageCars = () => {
    const { isOwner, axios, currency } = useAppContext();
    const [cars, setCars] = useState([]);

    const fetchOwnerCars = async () => {
        try {
            const { data } = await axios.get('/api/owner/my-cars');
            if (data.success) {
                setCars(data.cars);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch cars.");
        }
    };

    const toggleAvailability = async (carId) => {
        try {
            const { data } = await axios.patch(`/api/owner/cars/${carId}/toggle-availability`);
            if (data.success) {
                toast.success(data.message);
                setCars(prevCars =>
                    prevCars.map(car =>
                        car._id === carId ? { ...car, isAvailable: !car.isAvailable } : car
                    )
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    const deleteCar = async (carId) => {
        const confirm = window.confirm('Are you sure you want to remove this car listing?');
        if (!confirm) return;

        try {
            const { data } = await axios.delete(`/api/owner/cars/${carId}`);
            if (data.success) {
                toast.success(data.message);
               
                setCars(prevCars => prevCars.filter(car => car._id !== carId));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    useEffect(() => {
        if (isOwner) {
            fetchOwnerCars();
        }
    }, [isOwner]);

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            <Title title='Manage Cars' subTitle='View all listed cars, update their details, or remove them from the booking platform' />
            <div className='max-w-5xl w-full rounded-md overflow-hidden border border-gray-100 mt-6 shadow-md'>
                <table className='w-full border-collapse text-left text-sm text-gray-700'>
                    <thead className='bg-gray-50 text-gray-700'>
                        <tr>
                            <th className='p-3 font-medium'>Car</th>
                            <th className='p-3 font-medium max-md:hidden'>Category</th>
                            <th className='p-3 font-medium'>Price</th>
                            <th className='p-3 font-medium max-md:hidden'>Status</th>
                            <th className='p-3 font-medium'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr key={car._id} className='border-t border-gray-200 hover:bg-gray-50'>
                                <td className='p-3 flex items-center gap-3'>
                                    <img src={car.image} alt={`${car.brand} ${car.model}`} className='h-12 w-20 aspect-video rounded-md object-cover' />
                                    <div className='max-md:hidden'>
                                        <p className='font-medium'>{car.brand} {car.model}</p>
                                        <p className='text-xs text-gray-600'>{car.seating_capacity} Seats | {car.transmission}</p>
                                    </div>
                                </td>
                                <td className='p-3 max-md:hidden'>{car.category}</td>
                                <td className='p-3'>{currency}{car.pricePerDay}/day</td>
                                <td className='p-3 max-md:hidden'>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${car.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {car.isAvailable ? "Available" : "Unavailable"}
                                    </span>
                                </td>
                                <td className='p-3'>
                                    <div className='flex items-center gap-3'>
                                        <img onClick={() => toggleAvailability(car._id)} src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="Toggle availability"
                                            className='cursor-pointer h-10 w-10' title={car.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'} />
                                        <img onClick={() => deleteCar(car._id)} src={assets.delete_icon} alt="Delete car" className='cursor-pointer h-10 w-10' title='Remove Car' />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageCars;