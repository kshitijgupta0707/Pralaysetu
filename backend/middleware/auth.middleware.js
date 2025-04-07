import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("User authenticated:", req.user);
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authenticate = async (req, res, next) => {
  
    const token = req.cookies.token;
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      console.log("authenticated user:", req.user);
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
//   higher-order middleware function where you can sent parameters to the middleware function
//   This function checks if the user has the required role to access the route 


export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  console.log("Allowed roles:", allowedRoles);
  console.log("User role:", req.user?.role);
    if (!allowedRoles.includes(req.user?.role)) {
      console.log("Access denied for role:", req.user?.role);
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${req.user?.role || 'unknown'}`,
      });
    }
    console.log("Access granted for role:", req.user?.role);
    next();
  };
  