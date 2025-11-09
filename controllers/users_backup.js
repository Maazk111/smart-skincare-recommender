// functions of routes | Route's Work
import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser ,
         findUserByEmail,
         findUserByRole ,
         saveRecommendation, 
         decryptRecommendation,
         getAIRecommendation, blacklistToken} from "../services/users.js";

// Register
export const registerUser = async (req, res) => {
  const { name, email, password, role = "USER" } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if admin exists
    if (role === "ADMIN") {
      const existingAdmin = await findUserByRole("ADMIN");
      if (existingAdmin) {
        return res.status(403).json({ message: "An admin already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password: hashedPassword, role });

    // Generate JWT token for the new user
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ message: "User registered successfully", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "User Aleady exists Please Try with a Unique Email" });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout 
export const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    // Blacklist the token
    blacklistToken(token);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Generate and Save Recommendation
export const generateRecommendation = async (req, res) => {
  const { gender, ageRange, skinType, skinConcern, skinSensitivity, allergyIssue } = req.body;
  try {
    if (!gender || !ageRange || !skinType || !skinConcern || !skinSensitivity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const aiInput = { Gender: gender, "Age Range": ageRange, "Skin Type": skinType, "Skin Concern": skinConcern, "Skin Sensitivity": skinSensitivity, "Allergic Issue": allergyIssue || "None" };
    const aiRecommendation = await getAIRecommendation(aiInput);

    const recommendation = await saveRecommendation({
      userId: req.user.id,
      gender,
      ageRange,
      skinType,
      skinConcern,
      skinSensitivity,
      allergyIssue: allergyIssue || "None",
      recommendedProduct: aiRecommendation.recommended_product,
    });

    res.status(201).json({ message: "Recommendation generated", recommendation });
  } catch (error) {
    console.error("Error generating recommendation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch User Recommendations

export const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID

    // Fetch recommendations for the user
    const recommendations = await prisma.recommendation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Sort by most recent
    });

    // Decrypt the recommendedProduct
    const decryptedRecommendations = recommendations.map((rec) => {
      return {
        ...rec,
        recommendedProduct: decryptRecommendation(rec.recommendedProduct, rec.iv),
      };
    });

    res.status(200).json({
      message: 'User recommendations fetched',
      user: {
        name: req.user.name,
        email: req.user.email,
      },
      recommendations: decryptedRecommendations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Fetch all recommendations (Admin only)
export const getAllRecommendations = async (req, res) => {
  try {
    // Fetch all recommendations from the database
    const recommendations = await prisma.recommendation.findMany({
      include: {
        user: {
          select: { name: true, email: true }, // Fetch user details
        },
      },
    });

    // Decrypt the recommendedProduct for each recommendation
    const decryptedRecommendations = recommendations.map((rec) => {
      return {
        ...rec,
        recommendedProduct: decryptRecommendation(
          rec.recommendedProduct,
          rec.iv // Use the IV to decrypt the data
        ),
      };
    });

    res.status(200).json({
      message: "All recommendations fetched",
      recommendations: decryptedRecommendations,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Recommendation (Admin)
export const deleteRecommendation = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete recommendation by ID
    const deleted = await prisma.recommendation.delete({
      where: { id: parseInt(id) },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    res.status(200).json({ message: "Recommendation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a User Account (ADMIN)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the admin is trying to delete themselves
    if (parseInt(id) === req.user.id && req.user.role === "ADMIN") {
      return res
        .status(403)
        .json({ message: "Admins cannot delete their own account" });
    }

    // Delete the user from the database
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "User account deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Record to delete does not exist." });
  }
};


// View All Registered Users (ADMIN)
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      message: "All registered users fetched",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// getSingleRecommendation (USER)
export const getSingleRecommendation = async (req, res) => {
  const { id } = req.params;
  try {
    const recommendation = await prisma.recommendation.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id, // Ensure recommendation belongs to the logged-in user
      },
    });

    if (!recommendation) {
      return res
        .status(404)
        .json({ message: "Recommendation not found or unauthorized" });
    }

    // Decrypt recommendation product before returning
    const decryptedRecommendation = {
      ...recommendation,
      recommendedProduct: decryptRecommendation(
        recommendation.recommendedProduct,
        recommendation.iv
      ),
    };

    res
      .status(200)
      .json({ message: "Recommendation fetched", recommendation: decryptedRecommendation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


