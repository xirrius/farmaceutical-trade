import { axiosInstance, authInstance } from "../utils/axios";

export const createProduct = async (productData) => {
  try {
    const response = await authInstance.post("/products/", productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error registering user");
  }
};

export const getProducts = async ({
  page,
  limit,
  sortBy,
  order,
  search,
  category,
  subcategory,
  condition,
  status,
  maxPrice,
  maxQuantity,
}) => {
  try {
    const queryParams = new URLSearchParams({
    page,
    limit,
    sortBy,
    order,
    search,
    category,
    subcategory,
    condition,
    status,
    maxPrice,
    maxQuantity,
    }).toString();
    const response = await axiosInstance.get(`/products?${queryParams}`); 
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching products");
  }
};

export const getMyProducts = async () => {
  try {
    const response = await authInstance.get(`/products/my`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching products");
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching product");
  }
};

export const getUserProducts = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching product");
  }
};

export const editProduct = async (id, productData) => {
  try {
    const response = await authInstance.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error editing product.");
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await authInstance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error deleting product");
  }
};

export const uploadMedia = async (product_id, mediaFile) => {
    try {
        const response = await authInstance.post(
          `/products/${product_id}/media`,
          mediaFile,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 60000,
          }
        );
        return response.data;
    } catch (error) {
        throw new Error(error || "Error uploading media file.");
    }
};

export const deleteMedia = async (product_id, media_id) => {
  try {
    const response = await authInstance.delete(
      `/products/${product_id}/media/${media_id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error deleting media file");
  }
};

export const addReview = async (product_id, reviewData) => {
  try {
    const response = await authInstance.post(
      `/products/${product_id}/reviews`, reviewData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error adding review");
  }
};

export const getReviews = async (product_id) => {
  try {
    const response = await axiosInstance.get(
      `/products/${product_id}/reviews`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching reviews");
  }
};

export const deleteReview = async (product_id, review_id) => {
  try {
    const response = await authInstance.delete(
      `/products/${product_id}/reviews/${review_id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error deleting review");
  }
};
