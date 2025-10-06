
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { axios } = useAppContext();
    const navigate = useNavigate();
    
    // 1. Get the reset token from the URL
    const { resetToken } = useParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 2. Check if passwords match
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }
        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters long.");
        }

        try {
            // 3. Make the API call to your backend
            const { data } = await axios.post(`/api/user/reset-password/${resetToken}`, {
                password: password,
            });

            if (data.success) {
                toast.success(data.message);
                navigate("/"); // Redirect to homepage (which will show the login modal)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center">Set New Password</h2>
                <div className="w-full">
                    <p>New Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="border border-gray-300 rounded w-full p-2 mt-1"
                        required
                    />
                </div>
                <div className="w-full">
                    <p>Confirm New Password</p>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="border border-gray-300 rounded w-full p-2 mt-1"
                        required
                    />
                </div>
                <button type="submit" className="w-full py-2 text-white bg-black rounded-md hover:bg-gray-800">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;