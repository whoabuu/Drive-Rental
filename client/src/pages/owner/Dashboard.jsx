import React, {useEffect, useState } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/appContext'
import toast from 'react-hot-toast'

const Dashboard = () => {

    const{axios, isOwner, currency} = useAppContext();

    const [data, setData] = useState({
        totalCars: 0,
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        recentBookings: [],
        monthlyRevenue: 0
    })

    const dashboardCards = [
        {title:"Total Cars", value: data.totalCars, icon: assets.car_icon},
        {title:"Total Bookings", value: data.totalBookings, icon: assets.listIconColored},
        {title:"Pending Bookings", value: data.pendingBookings, icon: assets.cautionIconColored},
        {title:"Confirmed Bookings", value: data.completedBookings, icon: assets.listIconColored},
    ]

    const fetchDashBoardData = async()=>{
        try {
            const {data} = await axios.get('/api/owner/dashboard');
            if(data.success){
                setData(data.dashboardData);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        if(isOwner){
            fetchDashBoardData();
        }
        setData(dummyDashboardData)
    },[isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title title='Admin dashboard' subTitle='Monitor overall platform performance 
       including total cars, bookings, revenue, and recent activities'/>
       <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-5xl'>
         {dashboardCards.map((card, index)=>(
            <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md
             border border-gray-100 shadow-md'>
                <div>
                    <h1 className='text-lg text-gray-700'>{card.title}</h1>
                    <p className='text-lg font-smibold'>{card.value}</p>
                </div>
                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100'>
                    <img src={card.icon} alt="" className='w-4 h-4' />
                </div>
             </div>
         ))}
       </div>

       <div className='flex flex-wrap items-start gap-6 mb-8 w-full max-w-5xl'>

          <div className='p-4 md:p-6 border border-gray-100 shadow-md rounded-md max-w-2xl w-full'>
             <h1 className='text-xl font-medium'>Recent Bookings</h1>
             <p className='text-gray-700'>Latest customer bookings</p>
             {data.recentBookings.map((booking, index)=>(
                <div key={index} className='mt-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full 
                         bg-gray-100'>
                            <img src={assets.listIconColored} className='h-5 w-5' />
                        </div>
                        <div>
                           <p>{booking.car.brand} {booking.car.model} </p>
                           <p className='text-sm text-gray-700'> {booking.createdAt.split('T')[0]}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 font-medium'>
                        
                         <p className='text-sm text-gray-700'>{currency}{booking.price}</p>
                         <p className={`px-3 py-1 text-xs rounded-full ${booking.status === "confirmed" ? 
                         'bg-green-400/15 text-green-600':'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
                    </div>
                </div>
             ))}
          </div>

          <div className='p-4 md:p-6 mb-6 border border-gray-100 shadow-md rounded-md md:max-w-xs w-full'>
             <h1 className='text-xl'>Monthly Revenue</h1>
             <p className='text-gray-700'>Revenue for current month</p>
             <p className='text-3xl mt-6 font-semibold text-black'>{currency}{data.monthlyRevenue}</p>
          </div>

       </div>

    </div>
  )
}

export default Dashboard
