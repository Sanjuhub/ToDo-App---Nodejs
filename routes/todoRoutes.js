const { Router } = require('express');
const router = Router();
const {
  createBoard,
  deleteBoard,
  getBoard,
  createTask,
  updateTask,
  getTask,
  deleteTask,
} = require('../controllers/todoControllers');
const verifyToken = require('../middlewares/verifyJwtoken');
const {
  createTaskValidation,
  updateTaskValidation,
} = require('../middlewares/validation/taskValidation');

//Board Routes
router.post('/api/v1/board', verifyToken, createBoard);
router.delete('/api/v1/board/:id', verifyToken, deleteBoard);
router.get('/api/v1/board', verifyToken, getBoard);

//Task routes
router.post('/api/v1/task', verifyToken, createTaskValidation, createTask);
router.put('/api/v1/task/:id', verifyToken, updateTaskValidation, updateTask);
router.get('/api/v1/task', verifyToken, getTask);
router.delete('/api/v1/task/:id', verifyToken, deleteTask);

module.exports = router;
