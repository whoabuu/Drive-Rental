import User from "../models/User.js";

export const getPendingOwnerRequests = async(req, res) => {
    try {
        const pendingOwners = await User.find({ownerStatus: "Pending"}).select("-password");
        res.json({success: true, users: pendingOwners});
    } catch (error) {
        res.status(500).json({success: false, message: "Server error"});
    }
}

export const approveOwnerRequest = async(req, res) =>{
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        user.ownerStatus = "Approved";
        user.role = "owner";
        await user.save();

        res.json({success: true, message: "Owner request approved"});

    } catch (error) {
        res.status(500).json({success: false, message: "Server error"});      
    }
}