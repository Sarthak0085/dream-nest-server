import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { ErrorMiddleware } from "./middleware/error.js";
import { config } from "dotenv";
import router from "./routes/index.js";

const app = express();
config();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//Routes
app.use("/api", router);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 4000;

//error handling middleware
app.use(ErrorMiddleware);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on the Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
