import Booking from "../models/Booking.js"
import Car from "../models/Car.js";

//Func to check availability of car for a given date
const checkAvailability = async (car, pickupDate, returnDate) => {
     const bookings = await Booking.find({
        car, 
        pickupDate:{$lte: returnDate}, 
        returnDate:{$gte: pickupDate}
     });

     return bookings.length === 0;
}

//API to check availability of cars for the given date and location
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        //Find all cars in the given location that are marked as available
        const allCarsInLocation = await Car.find({ location, isAvailable: true });
        const carIds = allCarsInLocation.map(car => car._id);

        //Find all bookings that conflict with the requested dates for ANY of those cars
        const conflictingBookings = await Booking.find({
            car: { $in: carIds },
            pickupDate: { $lte: returnDate },
            returnDate: { $gte: pickupDate }
        });

        //Get the IDs of the cars that are already booked
        const unavailableCarIds = conflictingBookings.map(booking => booking.car.toString());

        //Filter out the unavailable cars
        const availableCars = allCarsInLocation.filter(car => !unavailableCarIds.includes(car._id.toString()));

        return res.json({ success: true, availableCars });

    } catch (error) {
        console.log("CHECK AVAILABILITY ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

//API to create booking
export const createBooking = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { car, pickupDate, returnDate } = req.body; // Get data from req.body

        // Check for availability first
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);

        if (!isAvailable) {
            return res.status(409).json({ success: false, message: "Car is not available for the selected dates." });
        }

        const carData = await Car.findById(car);
        if (!carData) {
            return res.status(404).json({ success: false, message: "Car not found." });
        }

        // Price calculation
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({ car, owner: carData.owner, user: loggedInUserId, pickupDate, returnDate, price });

        res.status(201).json({ success: true, message: "Booking created successfully!" });

    } catch (error) {
        console.log("CREATE BOOKING ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

//API to list user bookings
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;

        const bookings = await Booking.find({user:_id}).populate("car").sort({createdAt: -1});

        res.json({success: true, bookings});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

//API to get Owner bookings
export const getOwnerBookings = async (req, res)=>{
   try {
        if(req.user.role !== "owner"){
            return res.status(403).json({success: false, message: "Unauthorized"})
        }

        const bookings = await Booking.find({owner: req.user._id})
                                      .populate("car")
                                      .populate("user", "-password")
                                      .sort({createdAt: -1});
        res.status(200).json({success: true, bookings});
        

    } catch (error) {
        console.log(error.message);
       res.json({success: false, message: error.message});
    }
}

//API to change booking status
export const changeBookingStatus = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { bookingId, status } = req.body;

        // Check for valid status
        if (!["confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value." });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        if (booking.owner.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        booking.status = status;
        await booking.save();
        res.json({ success: true, message: 'Booking status updated.' });

    } catch (error) {
        console.log("CHANGE STATUS ERROR:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}






