import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import directorRoutes from "./src/routes/directorRoutes.js";
import movieRoutes from "./src/routes/movieRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import actorRoutes from "./src/routes/actorRoutes.js";
import statsRoutes from "./src/routes/statsRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/directors", directorRoutes);
app.use("/movies", movieRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);
app.use("/actors", actorRoutes);
app.use("/stats", statsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Movie Director API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
