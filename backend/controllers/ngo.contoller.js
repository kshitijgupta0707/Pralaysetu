import NGO from "../models/ngo.model.js";

// CREATE
export const createNGO = async (req, res) => {
  try {
    const ngo = new NGO({ ...req.body, registeredBy: req.userId });
    await ngo.save();
    res.status(201).json(ngo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
export const getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getNGOById = async (req, res) => {
  try {
    // console.log("called get ngo by id")
    // console.log("req.params.id", req.params.id);
    const ngo = await NGO.findById(req.params.id).populate("registeredBy", "firstName lastName email");
    // console.log("ngo is ", ngo)
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    res.json(ngo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateNGO = async (req, res) => {
  try {
    // console.log("called update ngo")

    const ngo = await NGO.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // console.log("updated ngo is ", ngo)
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    res.json(ngo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndDelete(req.params.id);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });
    res.json({ message: "NGO deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
