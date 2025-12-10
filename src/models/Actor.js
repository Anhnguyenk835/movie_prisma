import prisma from "../prismaClient.js";

class Actor {
  static async create(data) {
    return prisma.actor.create({ data });
  }

  static async findAll() {
    return prisma.actor.findMany({
      include: {
        movieActors: {
          include: { movie: true },
        },
      },
    });
  }

  static async update(id, data) {
    return prisma.actor.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  static async delete(id) {
    return prisma.actor.delete({
      where: { id: parseInt(id) },
    });
  }

  static async addToMovie(movieId, actorId) {
    return prisma.movieActor.create({
      data: {
        movieId: parseInt(movieId),
        actorId: parseInt(actorId),
      },
    });
  }

  static async removeFromMovie(movieId, actorId) {
    return prisma.movieActor.delete({
      where: {
        movieId_actorId: {
          movieId: parseInt(movieId),
          actorId: parseInt(actorId),
        },
      },
    });
  }

  // ========== TRANSACTION: THÊM NHIỀU DIỄN VIÊN ==========

  static async assignCast(movieId, actorIds) {
    return prisma.$transaction(async (tx) => {
      const movie = await tx.movie.findUnique({
        where: { id: parseInt(movieId) },
      });
      if (!movie) {
        throw new Error(`Movie id ${movieId} does not exist`);
      }

      const actors = await tx.actor.findMany({
        where: { id: { in: actorIds.map((id) => parseInt(id)) } },
      });
      if (actors.length !== actorIds.length) {
        throw new Error("One or more actors do not exist");
      }

      const assignments = await Promise.all(
        actorIds.map((actorId) =>
          tx.movieActor.create({
            data: {
              movieId: parseInt(movieId),
              actorId: parseInt(actorId),
            },
          })
        )
      );

      return assignments;
    });
  }
}

export default Actor;
