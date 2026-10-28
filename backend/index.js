const Movie = require("./models/Movie");
const cors = require("cors")
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const bookingRoutes = require("./routes/bookings");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
console.log("Booking route mounted!");
app.get("/api/bookings/test", (req, res) => {
  res.send("Booking route working!");
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });
const PORT = 5000;

app.get("/", (req, res) => {
    console.log("TEST ROUTE HIT!");
    res.send("IMovies Backend is Running!");
});
console.log("Movie routes loaded:", typeof movieRoutes);

app.post("/add-sample-movies", async (req, res) => {
  try {
    await Movie.deleteMany({});

    await Movie.insertMany([
      {
        title: "Inception",
        description: "A thief enters people's dreams to steal secrets.",
        genre: "Sci-Fi",
        duration: "2h 28m",
        language: "English",
        poster: ""
      },
      {
        title: "3 Idiots",
        description: "Three friends discover the true meaning of success.",
        genre: "Comedy",
        duration: "2h 50m",
        language: "Hindi",
        poster: ""
      },
      {
        title: "Dangal",
        description: "A father trains his daughters to become wrestlers.",
        genre: "Drama",
        duration: "2h 41m",
        language: "Hindi",
        poster: ""
      }
    ]);

    res.send("3 sample movies added!");
  } catch (error) {
    res.status(500).send("Error adding movies");
  }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});