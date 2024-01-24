import { Router } from "express"
import { addToWishlist, gerPropertyLists, getReservationLists, tripList } from "../controllers/user.controller.js";

const userRouter = Router();

/* GET TRIP LIST */
userRouter.get("/:userId/trips", tripList);

/* ADD LISTING TO WISHLIST */
userRouter.patch("/:userId/:listingId", addToWishlist);

/* GET PROPERTY LIST */
userRouter.get("/:userId/properties", gerPropertyLists);

/* GET RESERVATION LIST */
userRouter.get("/:userId/reservations", getReservationLists);

export default userRouter;