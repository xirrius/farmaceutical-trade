const { BadRequestError } = require("../errors");

module.exports = function (req, res, next) {
  const { email, name, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    if (![email, name, password].every(Boolean)) {
      throw new BadRequestError("Please provide name, email and password.");
    } else if (!validEmail(email)) {
      throw new BadRequestError("Email is invalid.");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      throw new BadRequestError("Please provide email and password.");
    } else if (!validEmail(email)) {
      throw new BadRequestError("Email is invalid.");
    }
  }

  next();
};
