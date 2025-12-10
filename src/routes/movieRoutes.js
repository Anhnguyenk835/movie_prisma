import express from "express";
import * as movieController from "../controllers/movieController.js";
import ActorController from "../controllers/actorController.js";

const router = express.Router();

router.post("/", movieController.createMovie);
router.get("/", movieController.getMovies);
router.get("/:id/score", movieController.getMovieScore);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

// POST /movies/:id/actors - Thêm diễn viên vào phim
router.post("/:id/actors", ActorController.addToMovie);

// DELETE /movies/:id/actors/:actorId - Gỡ diễn viên khỏi phim
router.delete("/:id/actors/:actorId", ActorController.removeFromMovie);

// POST /movies/:id/assign-cast - Transaction: Thêm nhiều diễn viên
router.post("/:id/assign-cast", ActorController.assignCast);

export default router;
