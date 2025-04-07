
// Updated Auth Controller
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { OTP } from "../models/otp.model.js";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import { mailSender } from "../utils/mailSender.js";
import { resetTemplate } from "../templates/reset.template.js";
import { otpTemplate } from "../templates/otp.template.js";
import crypto from "crypto";

export const sendOtp = async (req, res) => {
  try {
    //fetch email from the request body
    const { email } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });

    //if user already exist , then return a respoonse
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log("otp generated ", otp);

    //check unique otp or not
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      console.log("otp generated ", otp);
      result = await OTP.findOne({ otp });
    }

    //create an entry in db for otp
    const otpPayLoad = { email, otp };
    const otpBody = await OTP.create(otpPayLoad);
    console.log(otpBody);
    //check if otp is saved in db or not    
    if (!otpBody) {
      return res.status(400).json({
        success: false,
        message: "Error in saving otp",
      });
    }
    
    //send otp to the user email
    const mailResponse = await mailSender(
      email,
      "Email Verification",
      otpTemplate(otp));
      console.log("mail response", mailResponse);
      //check if mail is sent or not
    if (!mailResponse) {
      return res.status(400).json({
        success: false,
        message: "Error in sending otp",
      });
    }
    

    //return succesfull response
    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp,
    });
  } catch (e) {
    console.log("Error in sending otp");
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Otp not generated",
      error: e,
    });
  }
}
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, role, password, confirmPassword , otp , location } = req.body;
    //check if some data is missing
    if (!firstName || !lastName || !email || !role || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    
        //check whether length is >= 6
        if (password.length < 6) {
          return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
          });
        }
  if(password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password do not match"
    });
  }

   //check if user already exist
    //use find one it gives an single object
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log("User already exists");
      // console.log(existingUser);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    

     //compare the otp
    //find the most recent stored for the user

    const recentOtp = await OTP.find({ email })
      .sort({
        createdAt: -1,
      })
      .limit(1);

    console.log("Recent otp", recentOtp);

    //validate otp
    if (recentOtp.length == 0) {
      //otp not found
      return res.status(400).json({
        success: false,
        message: "Otp is expired",
      });
    }
    console.log(otp);
    console.log(recentOtp[0].otp);
    //compare otp
    if (otp != recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      });
    }





    //secure the password

    //optimal round jaida heavy hoga //if kam then can be hacked------------>
    // AES ke bre mein padhoo //worth it very interesting
    //Retry startegy to hash password for atleast three times
    let tryy = 0;
    let hashedPassword;
    while (tryy < 3) {
      try {
        hashedPassword = await bcrypt.hash(password, 10);
        if (hashedPassword) break;
      } catch (e) {
        tryy++;
        if (tryy == 3) {
          return res.status(500).json({
            success: false,
            data: "Error in hashing passwrord",
          });
        }
      }
    }
     


     //entry in db

     const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
      isVerified: true,
    })


    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user
    });
  }catch (error) {
    console.log(error);
    res.json({
      message: "User cannot be registed, Please try again later",
    }).status(500);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials"  });
    }

    // 👉 Get client IP
    // const rawIp =
    //   req.headers["x-forwarded-for"]?.split(",")[0] ||
    //   req.connection.remoteAddress;
    // const ip = rawIp?.replace("::ffff:", "") || "0.0.0.0";

    // // 👉 Get location from IP
    // let location = {};
    // try {
    //   const locationRes = await axios.get(`https://ipapi.co/${ip}/json/`);
    //   location = {
    //     ip,
    //     city: locationRes.data.city,
    //     region: locationRes.data.region,
    //     country: locationRes.data.country_name,
    //     latitude: locationRes.data.latitude,
    //     longitude: locationRes.data.longitude,
    //     method: "ip",
    //   };
    // } catch (locErr) {
    //   console.log("Failed to fetch IP location:", locErr.message);
    //   location = { ip, method: "ip", error: "Location fetch failed" };
    // }
    // console.log("User location:", location);
    const payload = {
      id: user._id,
      email: user.email,
    };

    // Generate JWT token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }

    const responseUser = user;
    responseUser.password = ""; // Remove password from response


    // Send token in HTTP-only cookie
    res.cookie("token", token,options).status(200).json({
      success: true,
      message: "Login successful",
      token,
      responseUser,
      // location
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 }); //expire immediattely get removed by maxage , erased by " "

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // Set token and expiration (15 minutes)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Send email
    const resetLink = `https://yourfrontend.com/reset-password?token=${token}&email=${email}`;
    await mailSender(email, "Reset Your Password", resetTemplate(resetLink));

    res.status(200).json({
      success: true,
      message: "Reset password link sent to email",
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // not expired
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
export const checkAuth = (req, res) => {
  try {
    console.log("Checking authentication status...");
    console.log(req.user)
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

