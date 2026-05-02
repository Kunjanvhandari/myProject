import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";
import borrowingsRoutes from "./routes/borrowings.js";
import reservationsRoutes from "./routes/reservations.js";
import userRoutes from "./routes/user.js";
import statsRoutes from "./routes/stats.js";
import seedRoutes from "./routes/seed.js";
import { connectDB } from "./lib/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/borrowings", borrowingsRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/seed", seedRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
