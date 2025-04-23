import express from "express";
import { createNGO, getAllNGOs, getNGOById, updateNGO, deleteNGO } from "../controllers/ngo.contoller.js"
const router = express.Router();

// CREATE a new NGO
router.post("/create", createNGO);

// READ all NGOs
router.get("/", getAllNGOs);

// READ a single NGO by ID
router.get("/:id", getNGOById);

// UPDATE an existing NGO by ID
router.put("/:id", updateNGO);

// DELETE an NGO by ID
router.delete("/:id", deleteNGO);

export  {router as ngoRoutes};
