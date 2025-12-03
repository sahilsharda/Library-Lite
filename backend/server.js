import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";
import membersRoutes from "./routes/members.js";
import loansRoutes from "./routes/loans.js";
import paymentsRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import usersRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error("Error:", err.message);

  // CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy violation" });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error("Server error:", error);
    throw error;
  }
});
