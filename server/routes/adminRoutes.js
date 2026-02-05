// server/routes/adminRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import {
  getPendingOwnerRequests,
  approveOwnerRequest,
  rejectOwnerRequest,
} from "../controllers/adminControllers.js";

const adminRouter = express.Router();

// These are API endpoints, not React components!
adminRouter.get("/pending-owners", protect, admin, getPendingOwnerRequests);
adminRouter.post("/approve-owner/:userId", protect, admin, approveOwnerRequest);
adminRouter.post("/reject-owner/:userId", protect, admin, rejectOwnerRequest);

export default adminRouter;
