import io from "socket.io-client";
import {
  addMessage,
  setOnlineUsers,
  markMessageAsRead,
} from "../redux/state/messageSlice";
import store from "../redux/store";

let socket = null;

export const initSocketListeners = () => {
  const userId = store.getState().auth?.user?.user_id;

  if (!userId) {
    console.error("User ID is undefined; cannot initialize socket listeners.");
    return;
  }

  // Initialize the socket connection with the user ID query only after authentication
  socket = io("http://localhost:5000", {
    query: { userId },
  });

  console.log("Socket initialized with user ID:", userId);

  // Set up event listeners
  socket.on("newMessage", (message) => {
    store.dispatch(addMessage(message));
  });

  socket.on("getOnlineUsers", (users) => {
    store.dispatch(setOnlineUsers(users));
  });
};

// Function to emit markAsRead
export const markAsRead = (message_id) => {
  if (socket) {
    socket.emit("markAsRead", { message_id });
  }
};

export const handleMarkAsRead = (message_id) => {
  // Emit event to the server
  markAsRead(message_id);
  // Optimistically update the UI
  store.dispatch(markMessageAsRead({ message_id }));
};

export default socket;
