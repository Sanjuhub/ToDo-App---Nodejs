const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signUpUser(req, res) {
  const { userName, email, phone, password } = req.body;

  //Hashing password
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = UserModel({
      userName,
      email,
      phone,
      password: hashedPassword,
    });
    const userData = await newUser.save();
    return res.json(userData);
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
}

module.exports = { signUpUser };
