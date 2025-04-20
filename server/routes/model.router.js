const axios  = require("axios");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      "https://medicine-recommender-model.onrender.com/predict",
      req.body
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;
