import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRoutes from "./routes/users.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// User Routes
app.use("/users", userRoutes);

// AI Routes (same as user routes for now)
app.use("/ai", userRoutes);

const PORT = process.env.PORT || 7653;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
