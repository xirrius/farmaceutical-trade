import {axiosInstance} from "../utils/axios"

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories/");
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching categories.");
  }
};

export const getSubCategories = async (id) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}/subcategories`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching subcategories.");
  }
};
