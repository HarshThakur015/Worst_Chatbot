const express = require("express");
const User = require("../Models/userModel"); // Import Mongoose Model

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, userName, age } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Create new user
    const newUser = new User({ firstName, lastName, email, userName, age });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later" });
  }
});

module.exports = router;
