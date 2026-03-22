const express = require("express");
const router = express.Router();
const db = require("../config/db");
const adminMiddleware = require("../middlewear/adminMiddleware");

// This route gets all movies from the database.
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM movies ORDER BY movie_id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Error fetching movies:", error);
    res.status(500).json({ message: "Error fetching movies" });
  }
});

// This route gets one movie using movie id.
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM movies WHERE movie_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log("Error fetching movie:", error);
    res.status(500).json({ message: "Error fetching movie" });
  }
});

// This route adds a new movie into the database and only admin can use it.
router.post("/", adminMiddleware, async (req, res) => {
  const { title, genre, duration, poster_url, description } = req.body;

  // This checks if required fields are missing.
  if (!title || !genre || !duration || !poster_url || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO movies (title, genre, duration, poster_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, genre, duration, poster_url, description]
    );

    res.status(201).json({
      message: "Movie added successfully",
      movie: result.rows[0],
    });
  } catch (error) {
    console.log("Error adding movie:", error);
    res.status(500).json({ message: "Error adding movie" });
  }
});

// This route updates a movie using movie id and only admin can use it.
router.put("/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, genre, duration, poster_url, description } = req.body;

  // This checks if required fields are missing.
  if (!title || !genre || !duration || !poster_url || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await db.query(
      "UPDATE movies SET title = $1, genre = $2, duration = $3, poster_url = $4, description = $5 WHERE movie_id = $6 RETURNING *",
      [title, genre, duration, poster_url, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      message: "Movie updated successfully",
      movie: result.rows[0],
    });
  } catch (error) {
    console.log("Error updating movie:", error);
    res.status(500).json({ message: "Error updating movie" });
  }
});

// This route deletes a movie using movie id and only admin can use it.
router.delete("/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM movies WHERE movie_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      message: "Movie deleted successfully",
      movie: result.rows[0],
    });
  } catch (error) {
    console.log("Error deleting movie:", error);
    res.status(500).json({ message: "Error deleting movie" });
  }
});

module.exports = router;