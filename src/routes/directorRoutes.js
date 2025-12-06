import express from "express";
import * as directorController from "../controllers/directorController.js";

const router = express.Router();

router.post("/", directorController.createDirector);
router.get("/", directorController.getDirectors);
router.put("/:id", directorController.updateDirector);
router.delete("/:id", directorController.deleteDirector);

export default router;
