const express = require('express');
const {
  listTasks,
  addTask,
  updateTask,
  completeTask,
  deleteTask
} = require('../../controllers/taskController');
const { authenticateToken } = require('../../middlewares/auth');
const router = express.Router();

router.use(authenticateToken); // Aplicar middleware de autenticação

router.get('/', listTasks);
router.post('/', addTask);
router.put('/:id', updateTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

module.exports = router;
