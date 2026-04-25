const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// CORS - allow all origins so the deployed link works
app.use(cors({
  origin: "*", 
  credentials: true
}));

app.use(express.json());

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "..", "public")));

// ROUTES
const submissionRoute = require("./routes/submission");
const challengeRoute = require("./routes/challenge");
const feedbackRoute = require("./routes/feedback");
const authRoute = require("./routes/auth");
const progressRoute = require("./routes/progress");
const sessionRoute = require("./routes/session");

// USE ROUTES
app.use("/api/session", sessionRoute);
app.use("/api/submission", submissionRoute);
app.use("/api/challenge", challengeRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/auth", authRoute);
app.use("/api/progress", progressRoute);

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});