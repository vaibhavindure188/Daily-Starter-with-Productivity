const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: String,
    access_token: String,
    refresh_token: String,
});

module.exports = mongoose.model("User", userSchema);
