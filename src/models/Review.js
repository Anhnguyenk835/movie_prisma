import prisma from "../prismaClient.js";

class Review {
  static async create(data) {
    return prisma.review.create({ data });
  }

  static async findAll(movieId) {
    return prisma.review.findMany({
      where: { movieId: parseInt(movieId) },
    });
  }

  static async update(id, data) {
    return prisma.review.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  static async delete(id) {
    return prisma.review.delete({
      where: { id: parseInt(id) },
    });
  }

  static async findAdvancedFilter(minStar, keyword) {
    return prisma.review.findMany({
      where: {
        AND: [{ rating: { gte: minStar } }, { content: { contains: keyword } }],
      },
      include: { user: true, movie: true },
    });
  }
}

export default Review;
