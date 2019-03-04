const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchma = mongoose.Schema({
  email: {type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchma.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchma);
