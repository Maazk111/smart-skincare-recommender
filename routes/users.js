// Call the API's
import express from "express";
import { registerUser, loginUser , 
         generateRecommendation , 
         getUserRecommendations , 
         deleteRecommendation, 
         getSingleRecommendation, 
         getAllUsers, deleteUser, logoutUser, getAllRecommendations} from "../controllers/users.js";
import { authenticateToken, authorizeRole } from "../middlewares/users.js";

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", authenticateToken, logoutUser);

// Protected route: User profile
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Access granted to protected route",
    user: req.user, // Decoded user data
  });
});

// Admin-only route:
router.get(
  "/admin/dashboard",
  authenticateToken, // Ensure user is authenticated
  authorizeRole("ADMIN"), // Ensure user has ADMIN role
  (req, res) => {
    res.status(200).json({ message: "Welcome, Admin!" });
  }
);


// Recommendations INPUT and OUTPUT
router.post(
  "/recommendations",
  authenticateToken, // Ensure the user is logged in
  generateRecommendation
);

// fetch recommendations:
router.get(
  "/recommendations",
  authenticateToken, // Ensure the user is logged in
  getUserRecommendations
);

// Fetch all recommendations (Admin only)
router.get(
  "/admin/all-recommendations",
  authenticateToken,
  authorizeRole("ADMIN"),
  getAllRecommendations
);

// View all users (ADMIN)

router.get("/admin/all-users", authenticateToken, authorizeRole("ADMIN"), getAllUsers);

// DELETE a User (ADMIN)
router.delete("/admin/delete-user/:id", authenticateToken, authorizeRole("ADMIN"), deleteUser);



// DELETE AN Recommendation (ADMIN)
router.delete(
  "/admin/delete-recommendation/:id",
  authenticateToken,
  authorizeRole("ADMIN"),
  deleteRecommendation
);

// Get a Single recommendation
router.get(
  "/recommendation/:id",
  authenticateToken,
  getSingleRecommendation
);


// Logout Route
router.post('/logout', authenticateToken, (req, res) => {
  // Blacklist the token (optional) or let the frontend delete it
  res.status(200).json({ message: 'Logged out successfully' });
});



export default router;
