// src/slices/messageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendMessage,
  getConversation,
  getAllConversations,
} from "../../services/messages";

export const sendMessageAsync = createAsyncThunk(
  "messages/sendMessage",
  async ({ receiver_id, content }) => {
    const data = await sendMessage(receiver_id, content);
    return data;
  }
);

export const fetchConversation = createAsyncThunk(
  "messages/fetchConversation",
  async (user_id) => {
    const data = await getConversation(user_id);
    return data;
  }
);

export const fetchAllConversations = createAsyncThunk(
  "messages/fetchAllConversations",
  async () => {
    const data = await getAllConversations();
    return data;
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    conversations: [],
    activeConversation: [],
    onlineUsers: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.activeConversation = {
        ...state.activeConversation,
        conversation: [
          ...(state.activeConversation.conversation || []),
          action.payload,
        ],
      };
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    markMessageAsRead: (state, action) => {
      const { message_id } = action.payload;
      const message = state.activeConversation.conversation.find(
        (msg) => msg.message_id === message_id
      );
      if (message) {
        message.is_read = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.activeConversation = {
          ...state.activeConversation,
          conversation: [
            ...(state.activeConversation.conversation || []),
            action.payload,
          ],
        };
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.activeConversation = action.payload;
      })
      .addCase(fetchAllConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      });
  },
});

export const { addMessage, setOnlineUsers, markMessageAsRead } = messageSlice.actions;

export default messageSlice.reducer;
