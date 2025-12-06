import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import directorRoutes from "./src/routes/directorRoutes.js";
import movieRoutes from "./src/routes/movieRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/directors", directorRoutes);
app.use("/movies", movieRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Movie Director API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
