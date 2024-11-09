import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected Succesfully!");
  })
  .catch((err) => {
    console.log("error occured : ", err);
  });

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is Running on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "INternal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
