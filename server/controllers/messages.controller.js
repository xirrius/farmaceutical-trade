const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const pool = require("../database/db");
const { getReceiverSocketId, io } = require("../utils/socket");

async function sendMessage(req, res) {
  const { content } = req.body;
  const { receiver_id } = req.params;
  const sender_id = req.user;

  const otherUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    receiver_id,
  ]);

  if (!otherUser.rows[0]) {
    throw new NotFoundError("User not found.");
  }

  if (!content) {
    throw new BadRequestError("Message cannot be empty.");
  }

  const result = await pool.query(
    `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
    [sender_id, receiver_id, content]
  );

  const receiverSocketId = getReceiverSocketId(receiver_id);
  if (receiverSocketId) {
    // used to send events to specific client
    io.to(receiverSocketId).emit("newMessage", result.rows[0]);
  }

  res.status(StatusCodes.CREATED).json({
    message: "Message sent successfully",
    messageData: result.rows[0],
  });
}

// GET /messages/conversation/:userId
async function getConversation(req, res) {
  const user_id = req.user;
  const other_userId = req.params.user_id;

  const otherUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    other_userId,
  ]);

  if (!otherUser.rows[0]) {
    throw new NotFoundError("User not found.");
  }

  const result = await pool.query(
    `SELECT * FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY timestamp`,
    [user_id, other_userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError("No messages found.");
  }

  return res.status(StatusCodes.OK).json({
    conversation: result.rows,
  });
}

// GET /messages/conversations
async function getAllConversations(req, res) {
  const user_id = req.user;

  const result = await pool.query(
    `
      SELECT DISTINCT
        CASE
          WHEN sender_id = $1 THEN receiver_id
          ELSE sender_id
        END AS user_id
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
      `,
    [user_id]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError("No conversations found.");
  }

  const userIds = result.rows.map((row) => row.user_id);

  // Fetch user details for each unique user_id in conversation
  const users = await pool.query(
    `SELECT user_id, name, profile_pic FROM users WHERE user_id = ANY($1::int[])`,
    [userIds]
  );

  if (users.rows.length === 0) {
    throw new NotFoundError("No conversations found.");
  }

  return res.status(StatusCodes.OK).json({ users: users.rows });
}

module.exports = { sendMessage, getConversation, getAllConversations };
