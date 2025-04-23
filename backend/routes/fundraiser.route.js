// routes/fundraiser.routes.js
import express from "express";
import { createFundraiser, getAllFundraisers, updateFundraiser } from "../controllers/fundraiser.contoller.js";

const router = express.Router();

router.post("/create", createFundraiser); // Create a fundraiser
router.get("/", getAllFundraisers); // Get all fundraisers  
router.put("/:id", updateFundraiser); // Update fundraiser
export {router as fundraiserRoutes};
