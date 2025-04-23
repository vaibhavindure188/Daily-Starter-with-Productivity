const express = require("express");
// const jwtDecode = require("jwt-decode"); // Ensure this is installed: npm install jwt-decode
const { jwtDecode }  =  require("jwt-decode");
const Task = require("../models/Tasks");
const router = express.Router();

// Middleware to extract email from JWT token
const authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  // Extract the token (removing "Bearer ")
  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ success: false, message: "Invalid token format" });
  }
  
  const token = tokenParts[1]; // ✅ Get only the token

  try {
    const decoded = jwtDecode(token);
    
    req.userEmail = decoded.email;
    if (!req.userEmail) {
      console.log("Token invalid: Email not found");
      return res.status(400).json({ success: false, message: "Invalid token: Email not found" });
    }
    
    next();
  } catch (error) {
    // console.log("Token invalid");
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};


// 📌 Get Tasks for a Specific Day (Authenticated)
router.get("/:date", authenticateUser, async (req, res) => {
  try {
    let date = req.params.date;
    if (date === "today") date = new Date().toISOString().split("T")[0];

    let taskEntry = await Task.findOne({ email: req.userEmail, date });

    if (!taskEntry) {
      return res.json({ date, tasks: [] });
    }

    res.json(taskEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// 📌 Add or Update Tasks for a Specific Date (Authenticated)
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { date, tasks } = req.body;

    if (!date || !tasks) {
      return res.status(400).json({ error: "Date and tasks are required" });
    }

    // Replace old tasks with new ones for the given date and email
    const updatedTaskEntry = await Task.findOneAndUpdate(
      { email: req.userEmail, date },
      { tasks, email: req.userEmail },
      { new: true, upsert: true }
    );

    res.json(updatedTaskEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to update tasks" });
  }
});

// 📌 Get Task Completion Stats (Authenticated)
router.get("/stats/:date", authenticateUser, async (req, res) => {
  try {
    const { date } = req.params;
    const taskEntry = await Task.findOne({ email: req.userEmail, date });

    if (!taskEntry) {
      return res.json({ date, completionRate: 0, totalTasks: 0 });
    }

    const totalTasks = taskEntry.tasks.length;
    const completedTasks = taskEntry.tasks.filter((task) => task.done).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.json({ date, completionRate, totalTasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch completion stats" });
  }
});

// 📌 Get all tasks for the authenticated user
router.get("/getall/all", authenticateUser, async (req, res) => {
  try {
    const allTasks = await Task.find(
      { email: req.userEmail },
      { date: 1, tasks: 1, _id: 0 }
    ).sort({ date: -1 });

    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all task data" });
  }
});

module.exports = router;
