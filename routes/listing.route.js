import { Router } from "express";
import { createListing, getListBySearch, getListingDetails, getlistByCategory } from "../controllers/listing.controller.js";

const listingRouter = Router();

/* CREATE LISTING */
listingRouter.post("/create", upload.array("listingPhotos"), createListing);

/* GET lISTINGS BY CATEGORY */
listingRouter.get("/", getlistByCategory);

/* GET LISTINGS BY SEARCH */
listingRouter.get("/search/:search", getListBySearch);

/* LISTING DETAILS */
listingRouter.get("/:listingId", getListingDetails);

export default listingRouter;