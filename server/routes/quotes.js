const express = require("express");
const axios = require("axios");
const https = require("https");

const router = express.Router();

// Create an HTTPS agent to bypass SSL errors (use only if necessary)
const agent = new https.Agent({ rejectUnauthorized: false });

async function fetchQuoteFromQuotable() {
    try {
        const response = await axios.get("https://api.quotable.io/random", { httpsAgent: agent });
        return {
            quote: response.data.content,
            author: response.data.author
        };
    } catch (error) {
        console.error("Quotable.io API failed:", error.message);
        return null; // Return null if fetching fails
    }
}

async function fetchQuoteFromZenQuotes() {
    try {
        const response = await axios.get("https://zenquotes.io/api/random", { httpsAgent: agent });
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            return {
                quote: response.data[0].q,
                author: response.data[0].a
            };
        }
    } catch (error) {
        console.error("ZenQuotes API failed:", error.message);
        return null;
    }
    return { quote: "No quote available", author: "Unknown" };
}

// Fetch a random quote with fallback
router.get("/quote", async (req, res) => {
    let quoteData = await fetchQuoteFromQuotable();
    
    if (!quoteData) {
        console.log("Switching to ZenQuotes API...");
        quoteData = await fetchQuoteFromZenQuotes();
    }

    res.json(quoteData);
});

module.exports = router;
