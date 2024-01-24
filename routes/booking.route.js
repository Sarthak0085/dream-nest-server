import { Router } from "express"
import { createBooking } from "../controllers/booking.controller.js";

const bookingRouter = Router();

/* CREATE BOOKING */
router.post("/create", createBooking);

export default bookingRouter;