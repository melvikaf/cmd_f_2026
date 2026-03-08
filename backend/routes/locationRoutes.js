const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/update", async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    if (!userId || latitude == null || longitude == null) {
      return res.status(400).json({
        message: "userId, latitude, and longitude are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔹 PRINT TO TERMINAL
    console.log("------ LOCATION UPDATE ------");
    console.log("User:", updatedUser.username);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("Stored coordinates:", updatedUser.location.coordinates);
    console.log("-----------------------------");

    return res.status(200).json({
      message: "Location updated successfully",
      location: updatedUser.location,
    });

  } catch (error) {
    console.error("Location update error:", error);
    return res.status(500).json({
      message: "Server error updating location",
      error: error.message,
    });
  }
});

module.exports = router;