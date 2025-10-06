import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and is in the correct format
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract just the token from the "Bearer <token>" string
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token is authentic and not expired (THE CRITICAL STEP)
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Fixed typo here

            // 4. Find the user by the ID from the token's payload
            // Attach the user object to the request (excluding the password)
            req.user = await User.findById(decoded.id).select('-password');

            // If the user associated with the token doesn't exist anymore
            if (!req.user) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            // If everything is good, move to the next function (the actual controller)
            next();

        } catch (error) {
            // This will catch errors from jwt.verify (e.g., expired token, invalid signature)
            return res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    }

    // If there's no token at all
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
};