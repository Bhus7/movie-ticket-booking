// This file starts the backend server and uses movie and auth routes.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// This line allows frontend to call backend.
app.use(cors());

// This line allows JSON data in request body.
app.use(express.json());

// This line sets the movie routes.
app.use("/api/movies", movieRoutes);

// This line sets the auth routes.
app.use("/api/auth", authRoutes);

// This line starts the server on the given port.
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});