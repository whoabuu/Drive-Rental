import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import Car from "../models/Car.js";

// Generate token
const generateToken = (userId) => {
  const payload = { id: userId };
  const options = { expiresIn: "3d" };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, phone_no, email, password } = req.body;

    if (
      !name ||
      !phone_no ||
      phone_no.length !== 10 ||
      !email ||
      !password ||
      password.length < 8
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all the fields correctly." });
    }

    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone_no }],
    });
    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }

    const user = await User.create({
      name,
      phone_no,
      email: email.toLowerCase(),
      password,
    });

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log("REGISTER ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());
    res.json({ success: true, token, message: "Login successful!" });
  } catch (error) {
    console.log("LOGIN ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({
        success: true,
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    const message = `
            <h3>Password Reset Request</h3>
            <p>Click the link below to reset your password. It expires in 15 minutes.</p>
            <a href="${resetUrl}" style="background: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>Or copy this link: ${resetUrl}</p>
        `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request - DriveRental",
        message: message,
      });
      res.json({ success: true, message: "Reset link sent to your email." });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error("FORGOT PASSWORD EMAIL ERROR:", emailErr.message);
      res
        .status(500)
        .json({ success: false, message: "Email failed to send." });
    }
  } catch (error) {
    console.log("FORGOT PASSWORD GLOBAL ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Token is invalid or has expired." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Cars
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    res.json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Request Owner Status
export const requestOwnerStatus = async (req, res) => {
  try {
    const { id } = req.user; // Use id from protect middleware
    const user = await User.findById(id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.ownerStatus === "Pending") {
      return res.json({
        success: false,
        message: "A request is already pending.",
      });
    }
    if (user.ownerStatus === "Approved") {
      return res.json({ success: false, message: "You are already an owner." });
    }

    user.ownerStatus = "Pending";
    await user.save();

    const adminUser = await User.findOne({ role: "admin" });

    if (adminUser) {
      const adminEmail = adminUser.email;
      const message = `
                <h3>New Owner Request</h3>
                <p><strong>User:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <a href="${process.env.CLIENT_URL}/admin/owner-requests">Approve in Admin Panel</a>
            `;

      try {
        await sendEmail({
          email: adminEmail,
          subject: "New Owner Request - DriveRental",
          message: message,
        });
      } catch (emailError) {
        console.log("Email Notification failed:", emailError.message);
      }
    }

    res.json({ success: true, message: "Request submitted. Admin notified." });
  } catch (error) {
    console.log("REQUEST OWNER STATUS ERROR:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
