import { catchAsyncError } from "../middleware/catchAsyncError.js";
import Booking from "../models/booking.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

/* CREATE BOOKING */
export const createBooking = catchAsyncError(async (req, res, next) => {
    try {
        const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

        if (!customerId || !hostId || !listingId || !startDate || !endDate || !totalPrice) {
            return next(new ErrorHandler("Please fill all the details", 400));
        }

        const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice });
        await newBooking.save();
        res.status(200).json(newBooking);
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler(err.message, 400));
        // res.status(400).json({ message: "Fail to create a new Booking!", error: err.message })
    }
});