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
    // Extract query parameters
    const {
      page = 1, // Current page (default: 1)
      limit = 10, // Items per page (default: 10)
      sortBy = "id", // Field to sort by (default: id)
      order = "asc", // Sort order: asc or desc (default: asc)
      search = "", // Search term for title (optional)
    } = req.query;

    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for search
    const where = search
      ? {
          title: {
            contains: search,
            mode: "insensitive", // Case-insensitive search
          },
        }
      : {};

    // Build orderBy clause
    const orderBy = {
      [sortBy]: order.toLowerCase(),
    };

    // Get total count for pagination metadata
    const totalCount = await Movie.count(where);

    // Get paginated movies
    const movies = await Movie.findAll({
      where,
      orderBy,
      skip,
      take: limitNum,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      data: movies,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
      },
      sorting: {
        sortBy,
        order,
      },
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
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
