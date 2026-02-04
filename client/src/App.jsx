import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import Footer from './components/Footer';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import Login from './components/Login';
import {Toaster} from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import ResetPassword from './pages/ResetPassword';
import AboutUs from './pages/AboutUs';
import AdminRoute from './components/AdminRoutes';
import OwnerRequests from './pages/admin/OwnerRequests';

const App = () => {

  const {showLogin} = useAppContext();
  const isOwnerPath = useLocation().pathname.includes("/owner");

  return (
    <>
      <Toaster />
      {showLogin && <Login/>}
      
      {!isOwnerPath && <Navbar/>}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/reset-password/:resetToken' element={<ResetPassword />} />
        <Route path='/car-details/:id' element={<CarDetails/>}/>
        <Route path='/cars' element={<Cars/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
        <Route path='/about-us' element={<AboutUs/>}/>

        <Route path='/owner' element={<Layout/>}>
             <Route index element={<Dashboard/>}/>
             <Route path='add-car' element={<AddCar/>}/>
             <Route path='manage-cars' element={<ManageCars/>}/>
             <Route path='manage-bookings' element={<ManageBookings/>}/>
        </Route>
        
        <Route path="/admin" element={<AdminRoute />}>
           <Route path="owner-requests" element={<OwnerRequests />} />
        </Route>
        
      </Routes>
      
      {!isOwnerPath && <Footer/>}
      
    </>
  )
}

export default App
