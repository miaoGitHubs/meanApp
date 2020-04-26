const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchma = mongoose.Schema({
  email: {type: String, required: true, unique: true },
  password: { type: String, required: true },
  portrait: { type: String, required: false}
});

userSchma.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchma);
