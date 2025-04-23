const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const emailRoutes = require("./routes/emailRoutes"); // ✅ Corrected path
const auth = require("./routes/auth");
dotenv.config();
const app = express();
app.use(express.json());
const news = require("../server/routes/news")
const finance = require("../server/routes/finanace")
const tasks = require("../server/routes/taskRoutes")
const quotes  = require("./routes/quotes")
const cors = require("cors");
app.use(cors());

// 📌 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err)); // ✅ Added error handling

// 📌 Routes

app.get("/home", (req, res) => {
  res.send("Welcome to Home");
});

app.use("/api", emailRoutes);  // http://localhost:5000/api/emails?email=indurevaibhav9@gmail.com
app.use("/auth", auth);// http://localhost:5000/auth/login
app.use("/newsApi", news); // http://localhost:5000/newsApi/news?category=technology
app.use("/finance", finance); // http://localhost:5000/finance/market-data
app.use("/taskManager" , tasks); // http://localhost:5000/taskManager/YYYY-MM-DD
/* in frontend 
const date = encodeURIComponent("2024-04-02");
fetch(`/tasks/${date}`);
*/

//  http://localhost:5000/taskManager/today  get tasks for today
//  http://localhost:5000/taskManager post req

/*
{
    "date": "2025-04-02",
    "tasks": [
        { "description": "Buy groceries", "done": true },
        { "description": "Finish project report", "done": false }
    ]
}
*/

// http://localhost:5000/taskManager/stats/YYYY-MM-DD get


app.use("/getQuotes", quotes); //  http://localhost:5000/getQuotes/quote get










// 📌 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
