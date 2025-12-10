import express from "express";
import ActorController from "../controllers/actorController.js";
import Actor from "../models/Actor.js";

const router = express.Router();

// CRUD Routes
router.post("/", ActorController.create);
router.get("/", ActorController.getAll);
router.put("/:id", ActorController.update);
router.delete("/:id", ActorController.delete);

export default router;
