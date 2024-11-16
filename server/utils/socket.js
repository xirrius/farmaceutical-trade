const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const pool = require("../database/db");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; //{user.id: socketID}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;
  
  // used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  console.log(userSocketMap);
  
  // Listen for 'markAsRead' event
  socket.on("markAsRead", async ({ message_id }) => {
    await pool.query(
      `UPDATE messages SET is_read = TRUE WHERE message_id = $1`,
      [message_id]
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getReceiverSocketId };
