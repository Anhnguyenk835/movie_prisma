import prisma from "../prismaClient.js";

class Movie {
  static async create(data) {
    return prisma.movie.create({ data });
  }

  static async findAll() {
    return prisma.movie.findMany({
      include: { director: true },
    });
  }

  static async update(id, data) {
    return prisma.movie.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  static async delete(id) {
    return prisma.movie.delete({
      where: { id: parseInt(id) },
    });
  }
}

export default Movie;
