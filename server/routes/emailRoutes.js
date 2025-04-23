const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User"); // Import User Model
// const {jwtDecode} = require("jwt-decode");

dotenv.config();
const router = express.Router();

async function getEmails(user) {
  try {
    let { access_token, refresh_token } = user;

    const oauth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    );

    oauth2Client.setCredentials({ access_token });

    // 📌 Check if the token is expired and refresh it
    try {
      await oauth2Client.getAccessToken(); // If expired, this will throw an error
    } catch (error) {
      console.log("Access token expired, refreshing...");
      if (!refresh_token) throw new Error("No refresh token available");

      // Refresh the token
      const { credentials } = await oauth2Client.refreshToken(refresh_token);
      access_token = credentials.access_token;

      // Update user in DB with new access_token
      await User.updateOne({ email: user.email }, { access_token });
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // 📌 Get timestamp for 50 hours ago
    const fiftyHoursAgo = Math.floor(Date.now() / 1000) - 50 * 60 * 60;

    // 📌 Fetch only unread emails from primary inbox
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 20,
      q: `is:unread category:primary after:${fiftyHoursAgo}`,
    });

    if (!res.data.messages) return [];

    const emails = await Promise.all(
      res.data.messages.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });
        const headers = email.data.payload.headers;

        return {
          id: msg.id,
          subject:
            headers.find((h) => h.name === "Subject")?.value || "No Subject",
          from: headers.find((h) => h.name === "From")?.value || "Unknown",
          snippet: email.data.snippet,
        };
      })
    );

    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw error;
  }
}


const jwt = require("jsonwebtoken");
const {jwtDecode} = require("jwt-decode");

// 📌 API Route to Fetch Emails for Logged-in User
router.get("/emails", async (req, res) => {
  let authHeader = req.header("Authorization");
  console.log("came in ", authHeader)
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  // Extract the token (ignoring "Bearer ")
  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    console.log("at line 94")
    return res.status(401).json({
      success: false,
      message: "Invalid token format",
    });
  }
 
  const token = tokenParts[1]; // Extract actual token
  console.log("Extracted Token:", token);

  try {
    // Decode token to get user email
    const decoded = jwtDecode(token);
    const userEmail = decoded.email;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Invalid token: Email not found",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch emails for the user
    const emails = await getEmails(user);
    res.json({ success: true, emails });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch emails",
      error: error.message,
    });
  }
});



module.exports = router;
