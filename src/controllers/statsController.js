import prisma from "../prismaClient.js";

// Tổng hợp dashboard: đếm User, Movie, Review
const getDashboardCounts = async (req, res) => {
  try {
    const [users, movies, reviews] = await Promise.all([
      prisma.user.count(),
      prisma.movie.count(),
      prisma.review.count(),
    ]);

    return res.json({
      users,
      movies,
      reviews,
    });
  } catch (error) {
    console.error("getDashboardCounts error:", error);
    return res
      .status(500)
      .json({
        error: "Failed to load dashboard stats",
        details: error.message,
      });
  }
};

// Tính tổng doanh thu tất cả phim
const getTotalRevenue = async (req, res) => {
  try {
    const result = await prisma.movie.aggregate({
      _sum: { revenue: true },
    });
    return res.json({ totalRevenue: result._sum.revenue ?? 0 });
  } catch (error) {
    console.error("getTotalRevenue error:", error);
    return res
      .status(500)
      .json({ error: "Failed to calculate revenue", details: error.message });
  }
};

// Tìm phim có điểm review cao nhất (_max)
const getTopRatingMovie = async (req, res) => {
  try {
    const top = await prisma.review.groupBy({
      by: ["movieId"],
      _max: { rating: true },
      orderBy: {
        _max: { rating: "desc" },
      },
      take: 1,
    });

    if (!top.length) {
      return res.status(404).json({ error: "No reviews found" });
    }

    const best = top[0];
    const movie = await prisma.movie.findUnique({
      where: { id: best.movieId },
      include: { director: true },
    });

    return res.json({
      movie,
      topRating: best._max.rating,
    });
  } catch (error) {
    console.error("getTopRatingMovie error:", error);
    return res
      .status(500)
      .json({ error: "Failed to find top rating", details: error.message });
  }
};

// Xóa hàng loạt review dưới 2 sao
const cleanupLowRatings = async (req, res) => {
  try {
    const result = await prisma.review.deleteMany({
      where: { rating: { lt: 2 } },
    });
    return res.json({
      deleted: result.count,
      message: "Cleanup completed",
    });
  } catch (error) {
    console.error("cleanupLowRatings error:", error);
    return res
      .status(500)
      .json({ error: "Failed to cleanup reviews", details: error.message });
  }
};

// Group By: thống kê số lượng review theo từng mức sao
const getReviewCountByStar = async (req, res) => {
  try {
    const grouped = await prisma.review.groupBy({
      by: ["rating"],
      _count: { rating: true },
      orderBy: { rating: "asc" },
    });

    return res.json(
      grouped.map((item) => ({
        star: item.rating,
        count: item._count.rating,
      }))
    );
  } catch (error) {
    console.error("getReviewCountByStar error:", error);
    return res.status(500).json({
      error: "Failed to group reviews",
      details: error.message,
    });
  }
};

// Raw SQL demo: truy vấn phức tạp bằng SQL thuần
const getRawComplexReport = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT
        m.id,
        m.title,
        d.name AS director,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.id) AS review_count,
        COALESCE(SUM(r.rating), 0) AS total_rating
      FROM "movie_prisma"."Movie" m
      JOIN "movie_prisma"."Director" d ON d.id = m."directorId"
      LEFT JOIN "movie_prisma"."Review" r ON r."movieId" = m.id
      GROUP BY m.id, d.name
      ORDER BY avg_rating DESC, review_count DESC
      LIMIT 10;
    `;

    return res.json({ rows: result });
  } catch (error) {
    console.error("getRawComplexReport error:", error);
    return res.status(500).json({
      error: "Failed to run raw SQL report",
      details: error.message,
    });
  }
};

export {
  getDashboardCounts,
  getTotalRevenue,
  getTopRatingMovie,
  cleanupLowRatings,
  getReviewCountByStar,
  getRawComplexReport,
};
