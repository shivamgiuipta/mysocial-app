const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

/* =========================
   CORS (MUST COME FIRST)
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mysocial-app.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

/* =========================
   JSON Middleware
========================= */
app.use(express.json());

/* =========================
   MongoDB
========================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* =========================
   Routes
========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

/* =========================
   Health Check
========================= */
app.get("/", (req, res) => {
  res.json({ message: "MySocial API is running" });
});

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

