const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validator = asyncHandler(async (req, res, next) => { 
  let token;
  let autHeader = req.headers.authorization || req.headers.Authorization; 
  if (autHeader) { 
    token = autHeader;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        res.status(401);
        throw new Error("Unauthorized user");
      }
      req.user = decode.user;  
      next();
    }); 
  } else {
    res.status(401);
    throw new Error("Unauthorized user"); 
  }
});

module.exports = validator;
