// server/routes/adminRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import {
  getPendingOwnerRequests,
  approveOwnerRequest,
} from "../controllers/adminControllers.js";

const adminRouter = express.Router();

// These are API endpoints, not React components!
adminRouter.get("/pending-owners", protect, admin, getPendingOwnerRequests);
adminRouter.post("/approve-owner/:userId", protect, admin, approveOwnerRequest);

export default adminRouter;
