const Group = require("../models/Group");
const Todo = require("../models/Todo");


// Get user's todos (admin sees all)
const getTodos = async (req, res) => {
  try {
    let query =  {user: req.user.id} ;
    const todos = await Todo.find(query)
      .populate("user", "username")
      .populate("groupId", "name color")
      .sort({ order: 1, createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create todo (assigned to logged user)
const createTodo = async (req, res) => {
  try {
    const { text, priority, dueDate, groupId, parentId } = req.body;

    if (!text || typeof text !== 'string') return res.status(400).json({ message: "Text is required" });

        if (groupId) {
      const group = await Group.findOne({ _id: groupId, user: req.user.id });
      if (!group) return res.status(400).json({ message: 'Invalid group' });
    }

    if (parentId) {
      const parent = await Todo.findOne({ _id: parentId, user: req.user.id });
      if (!parent)
        return res
          .status(400)
          .json({ message: "Parent todo not found or not owned" });
    }

    const todo = new Todo({
      text,
      user: req.user.id,
      priority: priority || "medium",
      dueDate: dueDate || null,
      groupId: groupId || null,
      parentId: parentId || null,
      order: 0,
    });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update todo (only if user owns it or admin)
const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    // Check ownership
    if (todo.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { text, completed, priority, dueDate, groupId, parentId, order } = req.body;
    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (groupId !== undefined) todo.groupId = groupId;
    if (parentId !== undefined) todo.parentId = parentId;
    if (order !== undefined) todo.order = order;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete todo (only if user owns it or admin)
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (todo.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Todo.deleteMany({ parentId: todo._id });
    await todo.deleteOne();
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nuevo endpoint para mover tarea (cambiar parentId y order)
const moveTodo = async (req, res) => {
  try {
    const { parentId, newOrder } = req.body;
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    if (todo.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (parentId !== undefined) todo.parentId = parentId || null;
    if (newOrder !== undefined) todo.order = newOrder;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo, moveTodo };
