const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser, getAllTodos, deleteAnyTodo } = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.use(authMiddleware, adminMiddleware);

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/todos', getAllTodos);
router.delete('/todos/:id', deleteAnyTodo);

module.exports = router;