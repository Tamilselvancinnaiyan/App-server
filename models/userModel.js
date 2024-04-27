const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String, 
    required: [true, 'Please enter a username']
  },
  email: {
    type: String, 
    required: [true, 'Please enter an email'],
    unique: [true, 'This email address is already registered']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
},{
  timestamps: true, 
});

module.exports = mongoose.model("users", userSchema);
