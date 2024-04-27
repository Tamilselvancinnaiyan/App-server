const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const e = require("express");

//@desc register a user
//@route GET /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("encrypted password", hashedPassword);
  try {
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ _id: newUser.id, email: newUser.email });
  } catch (error) {
    res.status(500);
    throw new Error("Error creating user");
  }
});


//@desc login user
//@route GET /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


//@desc get current user
//@route GET /api/user/currentUser
//@access private
const currentUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);

  } catch (error) {
    // Handle errors
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
registerUser,
  currentUser,
  loginUser
};


