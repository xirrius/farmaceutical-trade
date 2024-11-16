const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate");
const authorize = require("../middlewares/authorize");
const {
  register,
  login,
  getProfile,
  updateProfile,
  getOtherProfile,
} = require("../controllers/users.controller");
const upload = require("../middlewares/multer")

router.post("/register", validate, register);

router.post("/login", validate, login);

router.get('/profile', authorize, getProfile);

router.get('/profile/:id', getOtherProfile);

router.put('/profile/update', authorize, upload.single("profile_pic"), updateProfile);

module.exports = router;