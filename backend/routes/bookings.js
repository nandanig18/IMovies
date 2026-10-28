
const express = require("express");
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");

const router = express.Router();
router.get("/test", (req, res) => {
  res.send("Bookings router is working!");
});
console.log("Booking routes loaded!");
console.log("🔥 BOOKING POST ROUTE LOADED");
router.post("/", async (req, res) => {
    console.log("🔥 BOOKING REQUEST RECEIVED");
  try {
    const { movieId, seats } = req.body;

    if (!movieId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        message: "Please select at least one seat",
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    const booking = new Booking({
      movieId,
      seats,
      totalAmount: seats.length * 150,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking saved successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      message: "Failed to save booking",
    });
  }
});
router.get("/test", (req, res) => {
  res.send("Bookings router is working!");
});

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("movieId");
    res.json(bookings);
  } catch (error) {
    console.error("Booking history error:", error);
    res.status(500).json({
      message: "Failed to fetch booking history",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking cancelled successfully!",
    });
  } catch (error) {
    console.error("Cancellation error:", error);
    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
});

module.exports = router;
