const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (user_id) {
  return jwt.sign({ user_id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
