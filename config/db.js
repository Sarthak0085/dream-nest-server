import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database is connected to successfully on ${db.connection.name}`);
    } catch (error) {
        console.log(`Error connecting to db: ${error}`);
    }
}

export default connectDB;