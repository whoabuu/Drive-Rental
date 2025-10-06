import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    car: {
        type: ObjectId,
        ref: "Car",
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    owner: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    pickupDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true,
        validate: [
            function(value) {
                return this.pickupDate < value;
            },
            'Return date must be after the pickup date.'
        ]
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number.']
    }
}, {timestamps: true}); 

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;