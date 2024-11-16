import { authInstance } from "../utils/axios";

export const updateRentalStatus = async (rental_id) => {
  try {
    const response = await authInstance.patch(`/rentals/${rental_id}/return`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error updating rental entry"
    );
  }
};

export const getRentals = async ({ status, type }) => {
  try {
    const queryParams = new URLSearchParams({
      status,
      type,
    }).toString();
    const response = await authInstance.get(`/rentals?${queryParams}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching rental entries."
    );
  }
};

export const getRental = async (rental_id) => {
  try {
    const response = await authInstance.get(`/rentals/${rental_id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching rental entry."
    );
  }
};
