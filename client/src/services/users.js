import { axiosInstance, authInstance } from "../utils/axios";

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/users/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error registering user");
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error logging in user");
  }
};

export const getUserProfile = async () => {
  try {
    const response = await authInstance.get("/users/profile");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching user profile."
    );
  }
};

export const getOtherProfile = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/profile/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching user profile."
    );
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await authInstance.put("/users/profile/update", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error updating user profile."
    );
  }
};
