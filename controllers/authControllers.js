const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendSms = require('../services/twilioSms');
const sendEmail = require('../services/sendgridMailer');
const { generatorOtp, AddMinutesToDate } = require('../utilities/otpGenerator');
const {
  emailSubject,
  emailMessage,
  SmsMessage,
} = require('../utilities/createMessage');

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
    if (err.code === 11000) {
      return res
        .status(422)
        .json({ message: 'User with similar email/phone already exist.' });
    }
    return res.status(422).json({ message: err.message });
  }
}

async function loginUser(req, res) {
  const { emailOrPhone, password } = req.body;

  const isEmail = /^[0-9]+$/.test(emailOrPhone);
  var userExist;

  try {
    userExist = await UserModel.findOne({
      $or: [
        {
          email: emailOrPhone,
        },
        {
          phone: emailOrPhone,
        },
      ],
    });
    if (!userExist) {
      return res
        .status(400)
        .json({ message: 'Username or Password is invalid.' });
    }
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }

  //Checking password
  const validPassword = await bcrypt.compare(password, userExist.password);
  if (!validPassword) {
    return res
      .status(400)
      .json({ message: 'Username or Password is invalid.' });
  }

  const otp = generatorOtp();
  const expirationTime = AddMinutesToDate(new Date(), 15);

  var message;
  if (!isEmail) {
    message = emailMessage(otp);
    sendEmail(userExist.email, emailSubject, message)
      .then((msg) => {
        const otpData = { otp, expirationTime, verified: false };
        UserModel.findByIdAndUpdate(
          { _id: userExist._id },
          { otpData },
          { new: true },
          (err, data) => {
            if (err) {
              return res.status(422).json({ message: err.message });
            }
            return res.json({ status: 'success', user: userExist._id });
          }
        );
      })
      .catch((err) => {
        return res.json({ status: 'failed', message: err.message });
      });
  } else {
    message = SmsMessage(otp);
    sendSms(`+91${userExist.phone}`, message)
      .then((msg) => {
        const otpData = { otp, expirationTime, verified: false };
        UserModel.findByIdAndUpdate(
          { _id: userExist._id },
          { otpData },
          { new: true },
          (err, data) => {
            if (err) {
              return res.status(422).json({ message: err.message });
            }
            console.log(data);
            return res.json({ status: 'success', user: userExist._id });
          }
        );
      })
      .catch((err) => {
        return res.json({ status: 'failed', message: err.message });
      });
  }
}

async function verifyOtp(req, res) {
  const { userId, otp } = req.body;

  try {
    const userExist = await UserModel.findOne({ _id: userId });
    if (!userExist) {
      return res
        .status(400)
        .json({ message: 'Username or Password is invalid.' });
    }

    const timeDiff = userExist.otpData.expirationTime - new Date();

    if (timeDiff <= 0) {
      return res
        .status(422)
        .json({ status: 'expired', message: 'OTP Expired' });
    } else if (userExist.otpData.verified) {
      return res.status(422).json({ status: 'used', message: 'OTP Used' });
    } else if (otp !== userExist.otpData.otp) {
      return res
        .status(422)
        .json({ status: 'invalid', message: 'OTP did not match' });
    }

    //All ok, it's time to generate JWT token
    const jwtToken = jwt.sign(
      { userid: userExist._id, username: userExist.userName },
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: '1d',
      }
    );

    res.cookie('JWT_TOKEN', jwtToken, {
      httpOnly: true,
      // secure: false, //Set to true when using https
      sameSite: true,
      expires: new Date(Date.now() + 60 * 60 * 1000 * 24), //(minutes) * (seconds) * (miliseconds) * (hours)
    });

    userExist.otpData.verified = true;
    await userExist.save();

    const data = {
      jwtToken,
      expiresIn: '1d',
      userid: userExist._id,
      username: userExist.userName,
    };

    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
}

function logoutUser(req, res) {
  const accessToken = req.cookies.JWT_TOKEN;

  if (!accessToken) {
    return res.status(200).json({ message: 'You are already logged out.' });
  }

  res.cookie('JWT_TOKEN', '', { maxAge: 1 });
  res.json({ message: 'Logged out successfully' });
}

module.exports = { signUpUser, loginUser, verifyOtp, logoutUser };
