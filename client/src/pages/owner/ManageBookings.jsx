import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBookings = () => {
    const { axios, currency } = useAppContext();
    const [bookings, setBookings] = useState([]);

    const fetchOwnerBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/owner');
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const changeBookingStatus = async ({ bookingId, status }) => {
        try {
            const { data } = await axios.patch('/api/bookings/change-status', { bookingId, status });
            if (data.success) {
                toast.success(data.message);
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking._id === bookingId ? { ...booking, status: status } : booking
                    )
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    useEffect(() => {
        fetchOwnerBookings();
    }, []);

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            <Title title='Manage Bookings' subTitle='Track all customer bookings, approve or cancel requests, and manage booking statuses' />

            <div className='max-w-5xl w-full rounded-md overflow-hidden border border-gray-100 mt-6 shadow-md'>
                <table className='w-full border-collapse text-left text-sm text-gray-700'>
                    <thead className='bg-gray-50 text-gray-700'>
                        <tr>
                            <th className='p-3 font-medium'>Car</th>
                            <th className='p-3 font-medium max-md:hidden'>Date Range</th>
                            <th className='p-3 font-medium'>Total</th>
                            <th className='p-3 font-medium max-md:hidden'>Payment</th>
                            <th className='p-3 font-medium'>Status / Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id} className='border-t border-gray-200 hover:bg-gray-50'>
                                <td className='p-3 flex items-center gap-3'>
                                    <img src={booking.car.image} alt={`${booking.car.brand} ${booking.car.model}`} className='h-12 w-20 aspect-video rounded-md object-cover' />
                                    <p className='font-medium max-md:hidden'>{booking.car.brand} {booking.car.model}</p>
                                </td>
                                <td className='p-3 max-md:hidden'>
                                    {new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()}
                                </td>
                                <td className='p-3'>{currency}{booking.price}</td>
                                <td className='p-3 max-md:hidden'>
                                    <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>Offline</span>
                                </td>
                                <td className='p-3'>
                                    {booking.status === "pending" ? (
                                        <select
                                            onChange={(e) => changeBookingStatus({ bookingId: booking._id, status: e.target.value })}
                                            value={booking.status}
                                            className='px-2 py-1.5 text-gray-500 border border-gray-300 rounded-md outline-none bg-white'
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirm</option>
                                            <option value="cancelled">Cancel</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "confirmed" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBookings;