const Todo = require('../models/Todo');

// Get user's todos (admin sees all)
const getTodos = async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      query = {};
    } else {
      query = { user: req.user.id };
    }
    const todos = await Todo.find(query).populate('user', 'username').sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create todo (assigned to logged user)
const createTodo = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    
    const todo = new Todo({ text, user: req.user.id });
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
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    
    // Check ownership
    if (todo.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { text, completed } = req.body;
    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;
    
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
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    
    if (todo.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await todo.deleteOne();
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };