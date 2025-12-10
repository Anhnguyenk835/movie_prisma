import express from "express";
import {
  cleanupLowRatings,
  getDashboardCounts,
  getRawComplexReport,
  getReviewCountByStar,
  getTopRatingMovie,
  getTotalRevenue,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/dashboard", getDashboardCounts);
router.get("/revenue", getTotalRevenue);
router.get("/top-rating", getTopRatingMovie);
router.get("/reviews-by-star", getReviewCountByStar);
router.get("/raw-report", getRawComplexReport);
router.delete("/cleanup", cleanupLowRatings);

export default router;
