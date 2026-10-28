const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

// Get all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch movies",
    });
  }
});

// Add a movie
router.post("/", async (req, res) => {
  try {
    const { title, description, genre, duration, language, poster } = req.body;

    if (!title || !description || !genre || !duration || !language) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const movie = new Movie({
      title,
      description,
      genre,
      duration,
      language,
      poster,
    });

    await movie.save();

    res.status(201).json({
      message: "Movie added successfully",
      movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add movie",
    });
  }
});

module.exports = router;