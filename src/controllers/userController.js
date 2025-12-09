import User from "../models/User.js";

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("getUsers error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch users", details: error.message });
  }
};

const createUsers = async (req, res) => {
  try {
    // Debug: log the incoming body so we can see if `id` is present
    console.log("createUsers received body:", req.body);

    // Prevent clients from sending `id` as a string (schema expects Int autoincrement)
    const { id, ...payload } = req.body;
    console.log("createUsers id (raw):", id, "type:", typeof id);

    // Basic validation
    if (!payload.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Debug: payload that will be sent to Prisma
    console.log("createUsers payload to create:", payload);

    const user = await User.create(payload);
    res.status(201).json(user);
  } catch (error) {
    console.error("createUsers error:", error);
    res
      .status(500)
      .json({ error: "Failed to create users", details: error.message });
  }
};

const updateUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updated = await User.update(id, {
      name,
      email,
    });

    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update users", details: error.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Failed to delete users" });
  }
};

export { getUsers, createUsers, updateUsers, deleteUsers };
