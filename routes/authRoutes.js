const { Router } = require('express');
const router = Router();

const { signUpUser } = require('../controllers/authControllers');
const {
  signupUserValidation,
} = require('../middlewares/validation/userValidation');

router.post('/api/v1/signup', signupUserValidation, signUpUser);

module.exports = router;
