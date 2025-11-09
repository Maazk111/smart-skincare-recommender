// Interaction With the Database
import prisma from "../prisma/prismaClient.js";
import crypto from "crypto";
import { spawn } from "child_process";

export const createUser = async (data) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByRole = async (role) => {
  return prisma.user.findFirst({
    where: { role },
  });
};


// Store blacklisted tokens in memory (should use Redis in production)
const tokenBlacklist = new Set();

export const blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

export const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

const algorithm = "aes-256-ctr";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-encryption-key-for-development-32-chars-long";

export const saveRecommendation = async (data) => {
  const IV = crypto.randomBytes(16); // Generate fresh IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, IV);
  const encryptedRecommendation =
    cipher.update(data.recommendedProduct, "utf8", "hex") + cipher.final("hex");

  return prisma.recommendation.create({
    data: { ...data, recommendedProduct: encryptedRecommendation, iv: IV.toString("hex") },
  });
};


// Decrypt Recommendation when fetching
export const decryptRecommendation = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    ENCRYPTION_KEY,
    Buffer.from(iv, "hex")
  );
  return (
    decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8")
  );
};
// Recommendation Fetching from the CSV Through the AI Model
export const getAIRecommendation = (userInput) => {
  return new Promise((resolve, reject) => {
    const inputString = JSON.stringify(userInput);

    // ✅ use "python" instead of "python3" for Windows
    const pythonProcess = spawn("python", [process.env.PYTHON_SCRIPT_PATH || "ai_model.py", inputString]);

    let output = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const recommendation = JSON.parse(output);
          resolve(recommendation);
        } catch (err) {
          reject("Error parsing Python script output");
        }
      } else {
        reject(`Python script failed with code ${code}: ${error}`);
      }
    });
  });
};
