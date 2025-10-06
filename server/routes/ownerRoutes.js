import express from "express";
import { protect } from "../middleware/auth.js";
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerControllers.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get("/my-cars", protect, getOwnerCars);
ownerRouter.patch("/cars/:id/toggle-availability", protect, toggleCarAvailability);
ownerRouter.delete("/cars/:id", protect, deleteCar);

ownerRouter.get("/dashboard", protect, getDashboardData);

ownerRouter.patch("/update-image", upload.single("image"), protect, updateUserImage);


export default ownerRouter;