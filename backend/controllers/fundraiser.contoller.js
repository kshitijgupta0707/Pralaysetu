import Fundraiser from "../models/fundraiser.model.js";
import NGO from "../models/ngo.model.js";


export const createFundraiser = async (req, res) => {
  try {
    const { title, description, goalAmount, deadline, ngoId } = req.body;
     if(!title || !description || !goalAmount || !deadline || !ngoId) {
      return res.status(404).json({ message: "All fields are required" });
     }
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    const newFundraiser = new Fundraiser({
      title,
      description,
      goalAmount,
      deadline,
      ngoId,
    });

    await newFundraiser.save();
    const fundraiserr = await Fundraiser.findById(newFundraiser._id).populate("ngoId");
    res.status(201).json(fundraiserr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllFundraisers = async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find().populate("ngoId");
    res.json(fundraisers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateFundraiser = async (req, res) => {
  try {
    const { title, description, goalAmount, deadline, isActive } = req.body;
    const fundraiser = await Fundraiser.findByIdAndUpdate(
      req.params.id,
      { title, description, goalAmount, deadline, isActive },
      { new: true }
    ).populate("ngoId");

    if (!fundraiser) return res.status(404).json({ message: "Fundraiser not found" });
    res.json(fundraiser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
