const express = require("express");
const axios = require("axios");
const router = express.Router();

// 📈 Fetch Stock Prices (Yahoo Finance)
API_KEY = process.env.API_KEY_OF_STOCK;

// 💰 Fetch Crypto Prices (CoinGecko)
async function getStockIndices() {
    try {
        const indicesSymbols = "^BSESN,^NSEI,^GSPC,^IXIC,^DJI"; // Sensex, Nifty 50, S&P 500, Nasdaq, Dow Jones
        const url = `https://financialmodelingprep.com/api/v3/quote/${indicesSymbols}?apikey=${API_KEY}`;

        const response = await axios.get(url);
        
        return response.data.map(index => ({
            name: index.name,
            symbol: index.symbol,
            price: index.price,
            change: index.changesPercentage
        }));
    } catch (error) {
        console.error("Error fetching stock indices:", error);
        throw error;
    }
}

async function getStockPrices() {
    try {
        const stockSymbols = "AAPL,TSLA,GOOGL,MSFT,NVDA,AMZN";  
        const url = `https://financialmodelingprep.com/api/v3/quote/${stockSymbols}?apikey=${API_KEY}`;

        const response = await axios.get(url);
        
        return response.data.map(stock => ({
            symbol: stock.symbol,
            price: stock.price,
            change: stock.changesPercentage,
            name: stock.name
        }));
    } catch (error) {
        console.error("Error fetching stock prices:", error);
        throw error;
    }
}


async function getCryptoPrices() {
    try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,ripple,solana&vs_currencies=usd`;
        const response = await axios.get(url);

        return Object.keys(response.data).map(coin => ({
            name: coin.charAt(0).toUpperCase() + coin.slice(1),
            price: response.data[coin].usd
        }));
    } catch (error) {
        console.error("Error fetching crypto prices:", error);
        throw error;
    }
}


// 📌 API Route to Get Stock & Crypto Prices
router.get("/market-data", async (req, res) => {
    try {
        const [indices, stocks, crypto] = await Promise.all([
            // getStockIndices(), // requires subscription
            getStockPrices(),
            getCryptoPrices()
        ]);

        res.json({
            success: true,
            stock_indices: indices,
            stocks: stocks,
            cryptocurrencies: crypto
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch market data", error: error.message });
    }
});

module.exports = router;
