const express = require("express");
const User = require("../models/User");

const router = express.Router();

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.get("/nearby/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      !currentUser.location ||
      !currentUser.location.coordinates ||
      currentUser.location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message: "Current user location is missing",
      });
    }

    const [currentLongitude, currentLatitude] = currentUser.location.coordinates;
    const currentUserRadius =
      currentUser.preferences?.maxDistanceMeters || 50;

    console.log("------ MUTUAL MATCH SEARCH ------");
    console.log("Current user:", currentUser.username);
    console.log("Current user radius:", currentUserRadius);
    console.log("Current coordinates:", currentUser.location.coordinates);

    const nearbyCandidates = await User.find({
      _id: { $ne: currentUser._id },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [currentLongitude, currentLatitude],
          },
          $maxDistance: currentUserRadius,
        },
      },
    });

    const mutualMatches = nearbyCandidates.filter((otherUser) => {
      if (
        !otherUser.location ||
        !otherUser.location.coordinates ||
        otherUser.location.coordinates.length !== 2
      ) {
        return false;
      }

      const [otherLongitude, otherLatitude] = otherUser.location.coordinates;

      const distance = getDistanceMeters(
        currentLatitude,
        currentLongitude,
        otherLatitude,
        otherLongitude
      );

      const otherUserRadius =
        otherUser.preferences?.maxDistanceMeters;

      const isMutual = distance <= otherUserRadius;

      console.log("Candidate:", otherUser.username);
      console.log("Distance:", distance.toFixed(2), "meters");
      console.log("Other user's radius:", otherUserRadius);
      console.log("Mutual match:", isMutual);

      return isMutual;
    });

    console.log("Final mutual matches:", mutualMatches.length);
    console.log("-------------------------------");

    return res.status(200).json({
      message: "Mutual nearby users fetched successfully",
      users: mutualMatches,
    });
  } catch (error) {
    console.error("Nearby users error:", error);
    return res.status(500).json({
      message: "Server error fetching nearby users",
      error: error.message,
    });
  }
});

module.exports = router;