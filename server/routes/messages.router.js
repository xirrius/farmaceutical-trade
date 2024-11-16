const express = require("express");
const authorize = require("../middlewares/authorize");
const {
  sendMessage,
  getConversation,
  getAllConversations,
} = require("../controllers/messages.controller");

const router = express.Router();

router.post("/:receiver_id", authorize, sendMessage);

router.get("/:user_id/conversation/", authorize, getConversation);

router.get("/", authorize, getAllConversations);

module.exports = router;
