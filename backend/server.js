;
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { dbConnect } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";    
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { app , server } from "./config/socket.js";
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
      origin: "http://localhost:3000",
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


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`)
    dbConnect()
});
