import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
//   higher-order middleware function where you can sent parameters to the middleware function
//   This function checks if the user has the required role to access the route 

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user?.registerAs)) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${req.user?.registerAs || 'unknown'}`,
      });
    };
    next();
  };
  