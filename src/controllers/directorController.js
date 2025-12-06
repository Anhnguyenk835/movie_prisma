import Director from "../models/Director.js";

const createDirector = async (req, res) => {
  try {
    const { name } = req.body;
    console.log("Creating director with name:", name);
    const director = await Director.create({ name });
    res.json(director);
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getDirectors = async (req, res) => {
  try {
    const directors = await Director.findAll();
    res.json(directors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const director = await Director.update(id, { name });
    res.json(director);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;
    await Director.delete(id);
    res.json({ message: "Director deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createDirector, getDirectors, updateDirector, deleteDirector };
