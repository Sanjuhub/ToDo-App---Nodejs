const BoardModel = require('../models/boardModel');
const TodoModel = require('../models/todoModel');

async function createBoard(req, res) {
  const { boardName } = req.body;

  console.log(req.user);
  try {
    const existing = await BoardModel.findOne({ boardName });
    if (existing) {
      return res.status(422).json({ message: 'alread exist.' });
    }

    const newBoard = new BoardModel({
      boardName,
      createdById: req.user.userid,
    });
    await newBoard.save();
    return res.json(newBoard);
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
}

async function getBoard(req, res) {
  try {
    const boards = await BoardModel.find(
      {
        createdById: req.user.userid,
      },
      { _id: 1, boardName: 1 }
    ).populate({ path: 'createdById', select: ['_id', 'userName'] });
    if (boards.length <= 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.json(boards);
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
}

async function deleteBoard(req, res) {
  const { id } = req.params;

  try {
    const board = await BoardModel.findByIdAndDelete({ _id: id });
    if (board === null) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
}

async function createTask(req, res) {
  const { taskName, status, boardId } = req.body;
}

async function updateTask(req, res) {}
async function deleteTask(req, res) {}
async function getTask(req, res) {}

module.exports = {
  createBoard,
  deleteBoard,
  getBoard,
  createTask,
  updateTask,
  getTask,
  deleteTask,
};
