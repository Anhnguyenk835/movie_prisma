import Movie from "../models/Movie.js";

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

export { createMovie, getMovies, updateMovie, deleteMovie };
