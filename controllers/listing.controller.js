import { catchAsyncError } from "../middleware/catchAsyncError.js";
import Listing from "../models/listing.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

/* CREATE LISTING */
export const createListing = catchAsyncError(async (req, res, next) => {
  try {
    /* Take the information from the form */
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
      } = req.body;
      
      if (!creator || !category || !type || !streetAddress || !city || !province || !country || !guestCount || !bedroomCount || !bedCount
          || !bathroomCount || !title || !description || !highlight || !highlightDesc || !price) {
          return next(new ErrorHandler("Please fill all the details", 400));
      }

    const listingPhotos = req.files

      if (!listingPhotos) {
          return next(new ErrorHandler("No file uploaded.", 400));
    //   return res.status(400).send("No file uploaded.")
    }

    const listingPhotoPaths = listingPhotos.map((file) => file.path)

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    })

    await newListing.save()

    res.status(200).json(newListing)
  } catch (err) {
      console.log(err);
      return next(new ErrorHandler(err.message, 409));
    // res.status(409).json({ message: "Fail to create Listing", error: err.message })
  }
});

/* GET lISTINGS BY CATEGORY */
export const getlistByCategory = catchAsyncError(async (req, res, next) => {
    const qCategory = req.query.category;

    if (!qCategory) {
        return next(new ErrorHandler("Lit not found by category", 404));
    }

    try {
        let listings
        if (qCategory) {
            listings = await Listing.find({ category: qCategory }).populate("creator")
        } else {
            listings = await Listing.find().populate("creator")
        }

        res.status(200).json(listings)
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler(err.message, 404));
        // res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    }
});

/* GET LISTINGS BY SEARCH */
export const getListBySearch = catchAsyncError(async (req, res, next) => {
    const { search } = req.params

    try {
        let listings = []

        if (search === "all") {
            listings = await Listing.find().populate("creator")
        } else {
            listings = await Listing.find({
                $or: [
                    { category: { $regex: search, $options: "i" } },
                    { title: { $regex: search, $options: "i" } },
                ]
            }).populate("creator")
        }

        res.status(200).json(listings)
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler(err.message, 404));
        // res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    }
});

/* LISTING DETAILS */
export const getListingDetails = catchAsyncError(async (req, res, next) => {
    try {
        const { listingId } = req.params
        const listing = await Listing.findById(listingId).populate("creator")
        res.status(202).json(listing)
    } catch (err) {
        console.log(err);
        return next(new ErrorHandler(err.message, 404));
        // res.status(404).json({ message: "Listing can not found!", error: err.message })
    }
});