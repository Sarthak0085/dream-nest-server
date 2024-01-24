import { Router } from "express";
import authRouter from "./auth.route.js";
import listingRouter from "./listing.route.js";
import bookingRouter from "./booking.route.js";
import userRouter from "./user.route.js";

const router = Router();

/* ROUTES */
router.use("/auth", authRouter);
router.use("/properties", listingRouter);
router.use("/bookings", bookingRouter);
router.use("/users", userRouter);

export default router;