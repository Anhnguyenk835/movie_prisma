import Movie from "../models/Movie.js";
import prisma from "../prismaClient.js";

const createMovie = async (req, res) => {
  try {
    const { title, revenue, directorId } = req.body;
    const movie = await Movie.create({
      title,
      revenue: parseFloat(revenue),
      directorId: parseInt(directorId),
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, revenue } = req.body;
    const movie = await Movie.update(id, {
      title,
      revenue: revenue ? parseFloat(revenue) : undefined,
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.delete(id);
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tính điểm trung bình review cho 1 phim
const getMovieScore = async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    const result = await prisma.review.aggregate({
      where: { movieId },
      _avg: { rating: true },
      _count: true,
    });

    if (result._count === 0) {
      return res
        .status(404)
        .json({ error: `Movie ${movieId} has no reviews yet` });
    }

    res.json({
      movieId,
      averageRating: result._avg.rating,
      reviewCount: result._count,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to calculate movie score",
        details: error.message,
      });
  }
};

export { createMovie, getMovies, updateMovie, deleteMovie, getMovieScore };
