const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const authRoute = require("./routes/authRoute")
const chatRoute = require("./routes/chatRoute")
const caseRoute = require("./routes/caseRoute")
const evidenceRoute = require("./routes/evidenceRoute")
const adminRoute = require("./routes/adminRoute")
const publicRoute = require("./routes/publicRoute")
const uploadRoute = require("./routes/uploadRoute")
const path = require('path')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // Increased for development
  message: "Too many attempts. Try again later.",
});

app.use(helmet({
  crossOriginResourcePolicy: false,
}))
app.use(cookieParser())
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://parichay-frontend.vercel.app",
  "https://parichay-admin.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use("/api/auth", authLimiter, authRoute)
app.use("/api/chat", chatRoute)
app.use("/api/case", caseRoute)
app.use("/api/evidence", evidenceRoute)
app.use("/api/admin", adminRoute)
app.use("/api/public", publicRoute)
app.use("/api/upload", uploadRoute)

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = app;