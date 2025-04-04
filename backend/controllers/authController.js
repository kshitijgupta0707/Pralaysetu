const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendOtp");

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to Email
exports.sendOtp = async (req, res) => {
  try {
      const { email } = req.body;
      console.log(email)    

       const otp = generateOtp();
    
    let user = await User.findOne({ email });
    console.log(user)
    if (user && user.isVerified) return res.status(400).json({ message: "Email already verified. Please login." });
 console.log("moveforward")
    // Save OTP in the database
    if (!user) {
        console.log("new user")
        user = new User({ email, otp });
        console.log(user)
    } else {
      user.otp = otp;
    }

    await user.save();
    console.log(user)

    const emailSent = await sendOtpEmail(email, otp);
    if (!emailSent) return res.status(500).json({ message: "Failed to send OTP." });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP and register
exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp, name, password, role, location } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user details
    user.name = name;
    user.password = hashedPassword;
    user.role = role;
    user.location = location;
    user.isVerified = true;
    user.otp = null;

    await user.save();

    res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and is verified
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(400).json({ message: "Invalid credentials or email not verified" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
