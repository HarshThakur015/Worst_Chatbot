const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const jokeRoutes = require("./Routes/jokeRoutes"); // ✅ Import joke routes
const User = require("./models/User"); // Fixed path with lowercase 'm'

const app = express();

// ✅ Middleware to parse JSON
app.use(express.json());
app.use(cors()); // ✅ Enable CORS to allow frontend requests

// ✅ Use Routes
app.use("/users", userRoutes);
app.use("/jokes", jokeRoutes); // ✅ Add joke routes

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/customerSupportDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Verify password
app.post("/users/verify-password", async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const isMatch = await user.comparePassword(password);
    res.json({ verified: isMatch });
  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({ error: "Password verification failed" });
  }
});

// Update user
app.put("/users/:id", async (req, res) => {
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
app.delete("/users/:id", async (req, res) => {
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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));  
