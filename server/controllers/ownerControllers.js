import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs/promises";


export const changeRoleToOwner = async(req, res)=>{
    try {
        const {_id, role} = req.user;

        if (role === "owner") {
            return res.json({ success: true, message: "You are already registered as an owner." });
        }

        await User.findByIdAndUpdate(_id, {role: "owner"});
        res.json({success: true, message: "Now you can list cars"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

//API to List Car
export const addCar = async (req, res) => {
    const tempFilePath = req.file?.path; 

    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Car image is required." });
        }
        
        const { carData } = req.body;
        if (!carData) {
            return res.status(400).json({ success: false, message: "Car details are required." });
        }
        const car = JSON.parse(carData);
        
        const { _id } = req.user;

        const fileBuffer = await fs.readFile(tempFilePath);
        
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: req.file.originalname,
            folder: "/cars",
        });

        const optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [{ width: '1280' }, { quality: 'auto' }, { format: 'webp' }]
        });
        
        await Car.create({ ...car, owner: _id, image: optimizedImageURL });

        res.json({ success: true, message: 'Car listed successfully!' });

    } catch (error) {
        console.log("ADD CAR ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server error occurred." });
    } finally {
        if (tempFilePath) {
            try {
                await fs.unlink(tempFilePath);
            } catch (cleanupError) {
                console.error("Error cleaning up temporary file:", cleanupError);
            }
        }
    }
}

//API to list owner cars
export const  getOwnerCars = async(req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner: _id});
        res.json({success: true, cars});
    } catch (error) {
        console.log("ADD CAR ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server error occurred." });
    }
}

//API to toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { id: carId } = req.params; // Get ID from URL parameters

        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found." });
        }

        if (car.owner.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized action." });
        }

        car.isAvailable = !car.isAvailable;
        await car.save();

        res.json({ success: true, message: `Car availability is now ${car.isAvailable}` });

    } catch (error) {
        console.log("TOGGLE AVAILABILITY ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server error occurred." });
    }
}

//API to delete car
export const deleteCar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { id: carId } = req.params; //Get ID from URL parameters

        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found." });
        }

        if (car.owner.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized action." });
        }

        car.isAvailable = false;
        await car.save();

        res.json({ success: true, message: "Car has been removed successfully." });

    } catch (error) {
        console.log("DELETE CAR ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server error occurred." });
    }
}

//API to get dashboard data
export const getDashboardData = async(req, res)=>{
    try {
        const {_id, role} = req.user;

        if(role !== 'owner'){
           return res.status(403).json({success: false, message: "Unauthorized"});
        }
        
        const cars = await Car.find({owner: _id});
        const bookings = await Booking.find({owner: _id}).populate("car").sort({createdAt: -1});

        const pendingBookings = bookings.filter(booking => booking.status === "pending");
        const confirmedBookings = bookings.filter(booking => booking.status === "confirmed");

        //calculate monthly revenue
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const monthlyRevenue = confirmedBookings
            .filter(booking => {
                const bookingDate = new Date(booking.createdAt);
                return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
            })
            .reduce((acc, booking) => acc + booking.price, 0);

        const totalRevenue = confirmedBookings.reduce((acc, booking) => acc + booking.price, 0);


        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: confirmedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue,
            totalRevenue
        }

        res.json({success: true, dashboardData});

    } catch (error) {
        console.log("ADD CAR ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server error occurred." });
    }
}

//API to update user image
export const updateUserImage = async (req, res) => {
    const tempFilePath = req.file?.path;

    try {
          if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided." });
        }

        const { _id } = req.user;

        const fileBuffer = await fs.readFile(tempFilePath);

        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: `user_${_id}_${Date.now()}`, // Create a unique filename
            folder: "/users",
        });
    
        const optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [{ width: '400' }, { quality: 'auto' }, { format: 'webp' }]
        });

        await User.findByIdAndUpdate(_id, { image: optimizedImageURL });

        res.json({ success: true, message: "Image updated successfully!", image: optimizedImageURL });

    } catch (error) {
        console.log("UPDATE USER IMAGE ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server error occurred." });
    } finally {
        if (tempFilePath) {
            try {
                await fs.unlink(tempFilePath);
            } catch (cleanupError) {
                console.error("Error cleaning up temporary file:", cleanupError);
            }
        }
    }
};   
