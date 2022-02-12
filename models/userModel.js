const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otpData: {
    otp: { type: String },
    expirationTime: { type: Date },
    verified: { type: Boolean },
  },
});

module.exports = mongoose.model('User', userSchema);
