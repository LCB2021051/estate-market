import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("error occured connecting Database");
  })
  .catch((err) => {
    console.log("Database connected Succesfully!");
  });

const app = express();

app.listen(3000, () => {
  console.log("Server is Running on port 3000");
});
