const express = require('express');
const router = express.Router();
const { getTodos, createTodo, updateTodo, deleteTodo, moveTodo } = require('../controllers/todoController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware); // todas las rutas de todos requieren auth

router.route('/')
  .get(getTodos)
  .post(createTodo);

router.route('/:id')
  .put(updateTodo)
  .delete(deleteTodo);

router.put('/:id/move', moveTodo);

module.exports = router;