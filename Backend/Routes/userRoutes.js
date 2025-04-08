const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Updated to use the correct path with lowercase 'm'
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.use(express.json());

// Public routes (no auth required)
router.post("/signup", async (req, res) => {
  console.log("🟢 Received Signup Request:");
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body); // ✅ Log the received data

  const { firstName, lastName, email, username, age, password } = req.body;

  // 🔹 Check if all fields are provided
  if (!firstName || !lastName || !email || !username || !age || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    console.log("🔎 Checking if user exists...");
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ success: false, message: "User with this email or username already exists!" });
    }

    console.log("✅ Creating new user...");
    const newUser = new User({ firstName, lastName, email, username, age, password });

    await newUser.save(); // ✅ Save to MongoDB

    console.log("🎉 User registered successfully!");
    res.status(201).json({ success: true, message: "User registered successfully!", user: { ...newUser.toObject(), password: undefined } });
  } catch (error) {
    console.error("❌ Error in signup:", error);
    res.status(500).json({ success: false, message: "Error in signup", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login request received:', { username });

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        age: user.age
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected routes (auth required)

router.get("/profile", auth, async (req, res) => {
  try {
    res.json({
      user: {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        username: req.user.username,
        age: req.user.age
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, username, age } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, username, age },
      { new: true, select: '-password' }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Password verification route (protected)
router.post("/verify-password", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const isMatch = await req.user.comparePassword(password);
    res.json({ verified: isMatch });
  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({ error: "Password verification failed" });
  }
});

module.exports = router;
