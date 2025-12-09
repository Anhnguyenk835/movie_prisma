import prisma from "../prismaClient.js";

class User {
  static async create(data) {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      console.error("User.create error:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      console.error("User.findAll error:", error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      return await prisma.user.update({
        where: { id: parseInt(id) },
        data,
      });
    } catch (error) {
      console.error("User.update error:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await prisma.user.delete({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      console.error("User.delete error:", error);
      throw error;
    }
  }
}

export default User;
