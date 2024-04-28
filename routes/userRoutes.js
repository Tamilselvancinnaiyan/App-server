const express = require('express');
const router = express.Router();
const { registerUser, currentUser, loginUser } = require("../controllers/userController");
const validator = require('../middleware/tokenHandler');


  router.post("/register", async (req, res) => {
    try {
      await registerUser(req, res); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }

  });
  router.post('/login', async (req, res) => {
    try {
      await loginUser(req, res); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  router.get("/currentUser", validator, currentUser);

module.exports = router;
