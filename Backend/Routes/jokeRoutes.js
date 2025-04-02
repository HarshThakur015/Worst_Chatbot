const express = require("express");
const axios = require("axios");

const router = express.Router();

// Route to fetch a joke from the joke API
router.get("/get-joke", async (req, res) => {
  try {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: { Accept: "application/json" }
    });
    res.json({ joke: response.data.joke });
  } catch (error) {
    console.error("Error fetching joke:", error);
    res.status(500).json({ joke: "Oops! I couldn't fetch a joke. Try again later." });
  }
});

module.exports = router;
