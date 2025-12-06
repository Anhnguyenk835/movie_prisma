import prisma from "../prismaClient.js";

class Director {
  static async create(data) {
    return prisma.director.create({ data });
  }

  static async findAll() {
    return prisma.director.findMany();
  }

  static async update(id, data) {
    return prisma.director.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  static async delete(id) {
    return prisma.director.delete({
      where: { id: parseInt(id) },
    });
  }
}

export default Director;
