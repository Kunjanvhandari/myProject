import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { configurePassport } from "./config/passport.js";
import { initSocket } from "./config/socket.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowingRoutes from "./routes/borrowingRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import pustakalayaSeedRoutes from "./routes/pustakalayaSeedRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import fineRoutes from "./routes/fineRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { checkOverdueBooks } from "./jobs/overdueJob.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL?.split(",") || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads/profiles", express.static(path.join(__dirname, "uploads", "profiles")));

configurePassport(app);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/borrowings", borrowingRoutes);
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/seed", seedRoutes);
app.use("/api/v1/pustakalaya-seed", pustakalayaSeedRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/fines", fineRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Librivista API is running" });
});

async function start() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    initSocket(server);

    checkOverdueBooks();

    setInterval(checkOverdueBooks, 60 * 60 * 1000);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
