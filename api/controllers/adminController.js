const User = require('../models/User');
const Todo = require('../models/Todo');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (and their todos)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Todo.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all todos (admin view)
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().populate('user', 'username email');
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete any todo by admin
const deleteAnyTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    await todo.deleteOne();
    res.json({ message: 'Todo deleted by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, updateUserRole, deleteUser, getAllTodos, deleteAnyTodo };