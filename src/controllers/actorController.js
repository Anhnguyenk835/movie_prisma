import Actor from "../models/Actor.js";

class ActorController {
  // POST /actors
  static async create(req, res) {
    try {
      const actor = await Actor.create(req.body);
      res.status(201).json(actor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const actors = await Actor.findAll();
      res.json(actors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const actor = await Actor.update(req.params.id, req.body);
      res.json(actor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await Actor.delete(req.params.id);
      res.json({ message: "Actor deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // POST /movies/:id/actors - Thêm diễn viên vào phim
  static async addToMovie(req, res) {
    try {
      const result = await Actor.addToMovie(req.params.id, req.body.actorId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /movies/:id/actors/:actorId - Gỡ diễn viên khỏi phim
  static async removeFromMovie(req, res) {
    try {
      await Actor.removeFromMovie(req.params.id, req.params.actorId);
      res.json({ message: "Actor removed from movie" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // POST /movies/:id/assign-cast - Transaction: Thêm nhiều diễn viên
  static async assignCast(req, res) {
    try {
      const result = await Actor.assignCast(req.params.id, req.body.actorIds);
      res.status(201).json({
        message: "Actors added successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default ActorController;
