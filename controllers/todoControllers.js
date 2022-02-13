const BoardModel = require('../models/boardModel');
const TodoModel = require('../models/todoModel');
const mongoose = require('mongoose');

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
  try {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(422).json({ message: 'Invalid board Id' });
    }

    const board = await BoardModel.findById({ _id: boardId });

    if (board === null || board === undefined) {
      return res.status(422).json({ message: 'Board not found' });
    }

    const newTask = new TodoModel({
      taskName,
      status,
      boardId: board._id,
      createdById: req.user.userid,
    });

    await newTask.save();
    return res.json(newTask);
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
}

async function updateTask(req, res) {
  const { taskName, status } = req.body;
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'Invalid task Id' });
    }

    const task = await TodoModel.findById({ _id: id });

    if (task === null || task === undefined) {
      return res.status(422).json({ message: 'Task not found' });
    }

    const uptask = await TodoModel.findByIdAndUpdate(
      { _id: id },
      { taskName, status },
      { new: true }
    );

    return res.json(uptask);
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const board = await TodoModel.findByIdAndDelete({ _id: id });
    if (board === null) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
}

async function getTask(req, res) {
  try {
    const task = await TodoModel.find(
      {
        createdById: req.user.userid,
      },
      { _id: 1, taskName: 1, status: 1 }
    )
      .populate({ path: 'createdById', select: ['_id', 'userName'] })
      .populate({ path: 'boardId', select: ['_id', 'boardName'] });
    if (task.length <= 0) {
      return res.status(404).json({ message: 'Not found' });
    }
    return res.json(task);
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
}

module.exports = {
  createBoard,
  deleteBoard,
  getBoard,
  createTask,
  updateTask,
  getTask,
  deleteTask,
};
