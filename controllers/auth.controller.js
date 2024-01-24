import { catchAsyncError } from "../middleware/catchAsyncError.js";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* REGISTER USER */
export const register = catchAsyncError(async (req, res, next) => {
    try {
        /* Take all information from the form */
        const { firstName, lastName, email, password } = req.body;

        /* The uploaded file is available as req.file */
        const profileImage = req.file;

        if (!firstName || !lastName || !email || !password) {
            return next(new ErrorHandler("Please fill all the details", 400));
        }

        if (!profileImage) {
            return next(new ErrorHandler("No file uploaded", 400));
        }

        /* path to the uploaded profile photo */
        const profileImagePath = profileImage.path;

        /* Check if user exists */
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler("User Already Exists!", 409));
            // return res.status(409).json({ message: "User already exists!" });
        }

        /* Hash the password */
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        /* Create a new User */
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profileImagePath,
        });

        /* Save the new User */
        await newUser.save();

        /* Send a successful message */
        res
            .status(200)
            .json({ message: "User registered successfully!", user: newUser });
    } catch (err) {
        console.log(err);
        return next(new ErrorHandler(err.message, 500));
    }
});

/* LOGIN USER */
export const login = catchAsyncError(async (req, res, next) => {
    try {
        /* Take the infomation from the form */
        const { email, password } = req.body

        if (!email || !password) {
            return next(new ErrorHandler("Please fill email and password", 400));
        }

        /* Check if user exists */
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorHandler("User doesn't exist", 404));
            // return res.status(404).json({ message: "User doesn't exist!" });
        }

        /* Compare the password with the hashed password */
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return next( new ErrorHandler("Invalid Credentials!", 400));
            // return res.status(400).json({ message: "Invalid Credentials!" })
        }

        /* Generate JWT token */
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        delete user.password

        res.status(200).json({ token, user })

    } catch (err) {
        console.log(err);
        return next(new ErrorHandler(err.message, 500));
    }
});