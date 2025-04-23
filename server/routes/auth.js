const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User"); // Import User model

dotenv.config();
const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL; // URL where users will be redirected after login
const JWT_SECRET = process.env.JWT_SECRET; // Secret for generating JWT

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// 📌 Step 1: Redirect User to Google OAuth Login
router.get("/login", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "profile",
      "email",
    ],
    prompt: "consent",
  });

  res.redirect(authUrl);
});

// 📌 Step 2: Handle Google OAuth Callback
router.get("/google/callback", async (req, res) => {
  // this is callback user after logged in using google
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Retrieve user info
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const email = userInfo.data.email;
    const name = userInfo.data.name;

    // ✅ Check if user exists in MongoDB
    let user = await User.findOne({ email });

    if (user) {
      // 🔄 Update existing user tokens
      user.access_token = tokens.access_token;
      user.refresh_token = tokens.refresh_token || user.refresh_token;
    } else {
      // ➕ Create new user
      user = new User({
        email,
        name,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
    }

    // 📌 Save user to MongoDB
    await user.save();

    // 🔐 Generate JWT Token for authentication
    const jwtToken = jwt.sign(
      { email: user.email, id: user._id },
      JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    // 🎯 Redirect user to frontend with JWT token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${jwtToken}`);
  } catch (error) {
    console.error("Error during OAuth:", error);
    res.status(500).json({ success: false, message: "OAuth failed" });
  }
});

module.exports = router;
