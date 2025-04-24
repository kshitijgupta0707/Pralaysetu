import express from "express";
import { createNGO, getAllNGOs, getNGOById, updateNGO } from "../controllers/ngo.contoller.js"

const router = express.Router();

router.post("/create", createNGO); // create a new NGO
router.get("/", getAllNGOs); // get all NGOs
router.get("/:id", getNGOById); // get a single NGO by ID
router.put("/:id", updateNGO); // update an NGO by ID

export default router
