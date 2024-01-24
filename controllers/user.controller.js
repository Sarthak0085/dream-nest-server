import { catchAsyncError } from "../middleware/catchAsyncError.js";
import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

/* GET TRIP LIST */
export const tripList = catchAsyncError(async (req, res, next) => {
    try {
        const { userId } = req.params
        if (!userId) {
            return next(new ErrorHandler("Customer not found", 404));
        }
        const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId")
        res.status(202).json(trips)
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler(err.message, 404));
    }
});

/* ADD LISTING TO WISHLIST */
export const addToWishlist = catchAsyncError(async (req, res, next) => {
    try {
        const { userId, listingId } = req.params
        const user = await User.findById(userId)
        const listing = await Listing.findById(listingId).populate("creator")

        const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId)

        if (favoriteListing) {
            user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId)
            await user.save();
            res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList })
        } else {
            user.wishList.push(listing)
            await user.save()
            res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList })
        }
    } catch (err) {
        console.log(err);
        return next(new ErrorHandler(err.message, 404));
        // res.status(404).json({ error: err.message })
    }
});

/* GET PROPERTY LIST */
export const gerPropertyLists = catchAsyncError(async (req, res, next) => {
    try {
        const { userId } = req.params
        const properties = await Listing.find({ creator: userId }).populate("creator")
        res.status(202).json(properties)
    } catch (err) {
        console.log(err)
        return next(err.message, 404);
        // res.status(404).json({ message: "Can not find properties!", error: err.message })
    }
});

/* GET RESERVATION LIST */
export const getReservationLists = catchAsyncError(async (req, res) => {
    try {
        const { userId } = req.params
        const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId")
        res.status(202).json(reservations)
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler(err.message, 404));
        // res.status(404).json({ message: "Can not find reservations!", error: err.message })
    }
});