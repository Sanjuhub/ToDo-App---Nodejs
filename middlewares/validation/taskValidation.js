const joi = require('joi');

const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

function createTaskValidation(req, res, next) {
  const taskSchema = joi.object({
    taskName: joi.string().trim().min(3).required(),
    status: joi
      .string()
      .trim()
      .lowercase()
      .valid('todo', 'doing', 'done')
      .required(),
    boardId: joi.string().required(),
  });

  const { error, value } = taskSchema.validate(req.body, options);

  if (error) {
    // on fail return comma separated errors
    return res
      .status(400)
      .send(
        `Validation error: ${error.details.map((x) => x.message).join(', ')}`
      );
  }

  // on success replace req.body with validated value and trigger next middleware function
  req.body = value;
  next();
}

function updateTaskValidation(req, res, next) {
  const taskSchema = joi.object({
    taskName: joi.string().trim().min(3).empty(),
    status: joi.string().trim().lowercase().valid('todo', 'doing', 'done'),
  });

  const { error, value } = taskSchema.validate(req.body, options);

  if (error) {
    // on fail return comma separated errors
    return res
      .status(400)
      .send(
        `Validation error: ${error.details.map((x) => x.message).join(', ')}`
      );
  }

  // on success replace req.body with validated value and trigger next middleware function
  req.body = value;
  next();
}

module.exports = { createTaskValidation, updateTaskValidation };
