
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
import stripeRoutes from "./routes/stripe.route.js"
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
app.use('/api/stripe', stripeRoutes);
// app.use("/api", paymentRoute);

// app.get("/api/getkey", (req,res) => {
//     res.status(200).json({key: process.env.RAZORPAY_API_KEY});
// })

app.post("/api/predict_earthquake", async (req, res) => {
  try {
      const response = await axios.post('http://localhost:5001/api/predict_earthquake', req.body);
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: "Error in prediction" });
  }
});

// Route to handle flood prediction
app.post("/api/predict_flood", async (req, res) => {
  try {
    const modifiedRequestBody = {
      ...req.body,
      MonsoonIntensity: 4.987700,
      TopographyDrainage: 4.987400,
      RiverManagement: 5.007850,
      Deforestation: 5.010550,
      Urbanization: 4.985425,
      ClimateChange: 4.983300,
      DamsQuality: 5.019000,
      Siltation: 5.000300,
      AgriculturalPractices: 5.004300,
      Encroachments: 4.992725,
      IneffectiveDisasterPreparedness: 5.002725,
      DrainageSystems: 5.001850,
      CoastalVulnerability: 4.987075,
      Watersheds: 4.978125,
      DeterioratingInfrastructure: 4.986325,
      PopulationScore: 4.991500,
      WetlandLoss: 5.002450,
      InadequatePlanning: 5.003375,
      PoliticalFactors: 4.992100
    };

    // TopographyDrainage, RiverManagement, DamsQuality, Encroachments, Landslides, DeterioratingInfrastructure, PopulationScore

    const response = await axios.post('http://localhost:5001/api/predict_flood', modifiedRequestBody);
    res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: "Error in prediction" });
  }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  dbConnect()
  connectCloudinary()
  // testAuth()
  // deleteMessages()
});