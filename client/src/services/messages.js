import { authInstance } from "../utils/axios";

export const sendMessage = async (receiver_id, content) => {
  try {
    const response = await authInstance.post(
      `/messages/${receiver_id}`,
      content
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error sending the message."
    );
  }
};

export const getConversation = async (user_id) => {
  try {
    const response = await authInstance.get(
      `/messages/${user_id}/conversation`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching the conversation."
    );
  }
};
export const getAllConversations = async () => {
  try {
    const response = await authInstance.get(`/messages/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching the conversations."
    );
  }
};
