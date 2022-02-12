const { Router } = require('express');
const router = Router();

const {
  signUpUser,
  loginUser,
  logoutUser,
  verifyOtp,
} = require('../controllers/authControllers');
const {
  signupUserValidation,
} = require('../middlewares/validation/userValidation');

router.post('/api/v1/signup', signupUserValidation, signUpUser);
router.post('/api/v1/login', loginUser);
router.post('/api/v1/verifyOtp', verifyOtp);
router.get('/api/v1/logout', logoutUser);
// router.put('/api/v1/update', updateUser);

module.exports = router;
