const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

// 📌 Fetch news based on category
router.get("/news", async (req, res) => {
    const category = req.query.category || "general"; // Default to "general" if no category is provided
    
    try {
        const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${NEWS_API_KEY}`;
        const response = await axios.get(url);
        
        if (response.data.status !== "ok") {
            return res.status(500).json({ success: false, message: "Failed to fetch news" });
        }

        res.json({ success: true, articles: response.data.articles });
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ success: false, message: "Failed to fetch news", error: error.message });
    }
});

module.exports = router;
