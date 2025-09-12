import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { createAdminTable } from "./models/Admin.js";
import { createCategoryTable } from "./models/Category.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


//MIDDLEWARES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await createAdminTable();
    await createCategoryTable();
    console.log('Database tables initialized');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
