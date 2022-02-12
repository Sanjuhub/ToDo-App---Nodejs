const joi = require('joi');

const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

const userSchema = joi.object({
  userName: joi.string().trim().min(3).required(),
  email: joi.string().email().trim().required(),
  phone: joi
    .string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  password: joi.string().required().trim(),
});

function signupUserValidation(req, res, next) {
  const { error, value } = userSchema.validate(req.body, options);

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

module.exports = { signupUserValidation };
