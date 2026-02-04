import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import Car from "../models/Car.js";

//Generate token
const generateToken = (userId)=>{
     const payload = {id: userId};
     const options = {expiresIn: '3d'};
     return jwt.sign(payload, process.env.JWT_SECRET, options);
}

//Register User
export const registerUser = async(req, res)=>{
    try {
        const {name, phone_no, email, password} = req.body;

        if(!name || !phone_no || phone_no.length !==10 || !email || !password || password.length<8){
            return res.status(400).json({success: false, message: "Fill all the fields"});
        }

        const userExists = await User.findOne({$or: [{ email }, { phone_no }]});
        if(userExists){
            return res.status(409).json({success: false, message: "User already exits"});
        }

        

        const user = await User.create({
            name, phone_no, email, password
        });

        const token = generateToken(user._id.toString());
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

// login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user._id.toString());
        res.json({ success: true, token, message: "Login successful!" });

    } catch (error) {
        console.log("LOGIN ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

//forgot password 
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: true, message: "If a user with that email exists, a password reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link to complete the process within ten minutes: \n\n ${resetUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request for DriveRental',
            message: message,
        });

        res.json({ success: true, message: "Password reset link has been sent to your email." });

    } catch (error) {
        console.log("FORGOT PASSWORD ERROR:", error.message);
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
//Reset password
export const resetPassword = async (req, res) => {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;

        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
        }

        // Find the user by the token AND check if the token is not expired
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() } // $gt means "greater than"
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Password reset token is invalid or has expired." });
        }

        // Set the new password and clear the reset token fields
        user.password = password; 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ success: true, message: "Password has been reset successfully." });

    } catch (error) {
        console.log("RESET PASSWORD ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

//Get user data using token
export const getUserData = async(req, res) => {
    try {
        const {user} = req;
        res.json({success: true, user});
    } catch (error) {
        console.log("RESET PASSWORD ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

//Get all cars for frontend
export const getCars = async(req, res) => {
    try {
        const cars = await Car.find({isAvailable: true});
        res.json({success: true, cars});
        
    } catch (error) {
        console.log("GET CARS ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


export const requestOwnerStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.findById(_id);

        if (user.ownerStatus === 'Pending' || user.ownerStatus === 'Approved') {
            return res.json({ success: true, message: "A request has already been submitted." });
        }

        user.ownerStatus = 'Pending';
        await user.save();

        res.json({ success: true, message: "Your request to become an owner has been submitted and is pending review." });

    } catch (error) {
        console.log("REQUEST OWNER STATUS ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};