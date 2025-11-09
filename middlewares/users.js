import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../services/users.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not provided or invalid" });
  }

  const token = authHeader.split(" ")[1];

  // Check if the token is blacklisted
  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Pass control to the next handler
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Role-based authorization middleware
export const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied: Insufficient privileges" });
      }
      next();
    };
  };