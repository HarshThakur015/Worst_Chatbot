const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Updated to use the correct path with lowercase 'm'

router.use(express.json());

// 🔹 GET All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in fetching data",
    });
  }
});

// 🔹 SIGNUP (POST Request) ✅ Fixed Route to `/signup`
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

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, username, age } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, username, age },
      { new: true, select: '-password' } // Return updated user without password
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

// Delete user
router.delete("/:id", async (req, res) => {
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

// Login route
router.post("/login", async (req, res) => {
  console.log("🟢 Received Login Request:");
  console.log("Request Body:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  try {
    console.log("🔎 Finding user...");
    const user = await User.findOne({ username });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    console.log("🔐 Verifying password...");
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    console.log("✅ Login successful!");
    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        age: user.age
      }
    });
  } catch (error) {
    console.error("❌ Error in login:", error);
    res.status(500).json({ success: false, message: "Error in login", error: error.message });
  }
});

module.exports = router;
