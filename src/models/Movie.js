import prisma from "../prismaClient.js";

class Movie {
  static async create(data) {
    return prisma.movie.create({ data });
  }

  static async findAll(options = {}) {
    const { where, orderBy, skip, take } = options;

    return prisma.movie.findMany({
      where,
      orderBy,
      skip,
      take,
      include: { director: true },
    });
  }

  static async count(where = {}) {
    return prisma.movie.count({ where });
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
