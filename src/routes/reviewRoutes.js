import express from "express";
import {
  createReview,
  getReviewsByMovie,
  deleteReview,
  getFilteredReviews,
  updateReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/filtered", getFilteredReviews);

router.get("/movie/:id", getReviewsByMovie);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
