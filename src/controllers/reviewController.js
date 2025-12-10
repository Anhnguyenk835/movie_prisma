import Review from "../models/Review.js";
import prisma from "../prismaClient.js";

const createReview = async (req, res) => {
  // Debug incoming body
  console.log("createReview received body:", req.body);

  // Expecting `userId` (not `reviewer`) to link to User model
  const { movieId, userId, rating, content } = req.body;

  if (typeof rating === "undefined") {
    return res.status(400).json({ error: "Rating is required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  if (!movieId || !userId) {
    return res.status(400).json({ error: "movieId and userId are required" });
  }

  try {
    // Check that referenced movie and user exist to avoid FK constraint errors
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(movieId) },
    });
    if (!movie) {
      return res
        .status(400)
        .json({ error: `Movie with id=${movieId} does not exist` });
    }
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: `User with id=${userId} does not exist` });
    }
    const review = await Review.create({
      movieId: parseInt(movieId),
      userId: parseInt(userId),
      rating: parseInt(rating),
      content,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("createReview error:", error);
    res
      .status(500)
      .json({ error: "Failed to create review", details: error.message });
  }
};

const getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.findAll(req.params.id || req.params.movieId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

const deleteReview = async (req, res) => {
  try {
    await Review.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Failed to delete review" });
  }
};

const getFilteredReviews = async (req, res) => {
  const { minStar, keyword } = req.query;
  try {
    const parsedMinStar = parseInt(minStar) || 1;
    const parsedKeyword = keyword || "";
    const reviews = await Review.findAdvancedFilter(
      parsedMinStar,
      parsedKeyword
    );
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch filtered reviews" });
  }
};

const updateReview = async (req, res) => {
  try {
    console.log("updateReview params:", req.params);
    console.log("updateReview body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({
          error:
            "Request body is empty. Send JSON with Content-Type: application/json",
        });
    }

    const id = parseInt(req.params.id);

    // If updating relations, verify referenced records exist
    const { movieId, userId } = req.body;
    if (movieId) {
      const movie = await prisma.movie.findUnique({
        where: { id: parseInt(movieId) },
      });
      if (!movie)
        return res
          .status(400)
          .json({ error: `Movie with id=${movieId} does not exist` });
    }
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      if (!user)
        return res
          .status(400)
          .json({ error: `User with id=${userId} does not exist` });
    }

    const updated = await Review.update(id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error("updateReview error:", error);
    res
      .status(500)
      .json({ error: "Failed to update review", details: error.message });
  }
};

export {
  createReview,
  getReviewsByMovie,
  deleteReview,
  getFilteredReviews,
  updateReview,
};
