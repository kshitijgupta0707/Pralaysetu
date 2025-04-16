
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { dbConnect } from "./config/database.js";
import authRoutes from "./routes/auth.route.js";
import reportRoutes from "./routes/report.route.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { app, server } from "./config/socket.js";
import { connectCloudinary } from "./config/cloudinary.js";
import helpRoutes from "./routes/help.route.js"
import dashboardRoutes from "./routes/dashboard.route.js";
import adminRoutes from "./routes/admin.route.js"
import notificationRoute from "./routes/notification.route.js"
// import paymentRoute from "./routes/payment.route.js"
import { testAuth } from "./controllers/notification.controller.js";
// import { deleteMessages } from "./seedss/deleteData.js";
import axios from "axios";
dotenv.config();


// Middleware
//to remove cors error
// Middleware for parsing files
app.use(
  fileUpload({
    useTempFiles: true, // Enables temporary file storage
    tempFileDir: "/tmp/", // Temporary directory for uploaded files
  })
);
app.use(cors(
  {

    origin: ["http://localhost:5173",
      "https://pralaysetu.vercel.app"],
    credentials: true

  }
))
//so you can send json response and request
app.use(express.json());

//so that we can access the data in the cookie file

app.use(cookieParser());

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api", paymentRoute);

// app.get("/api/getkey", (req,res) => {
//     res.status(200).json({key: process.env.RAZORPAY_API_KEY});
// })

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  dbConnect()
  connectCloudinary()
  // testAuth()
  // deleteMessages()
});