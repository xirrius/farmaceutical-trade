import { authInstance } from "../utils/axios";

export const createTransaction = async (transactionData) => {
  try {
    const response = await authInstance.post("/transactions/", transactionData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error creating transaction."
    );
  }
};

export const updateTransactionStatus = async (transaction_id, status) => {
  try {
    const response = await authInstance.patch(
      `/transactions/${transaction_id}/status`,
      status
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error updating transaction."
    );
  }
};

export const getTransactions = async ({ status, order, type }) => {
  try {
    const queryParams = new URLSearchParams({
      status,
      order,
      type,
    }).toString();
    const response = await authInstance.get(`/transactions?${queryParams}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching transactions."
    );
  }
};

export const getTransaction = async (transaction_id) => {
  try {
    const response = await authInstance.get(`/transactions/${transaction_id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching transaction."
    );
  }
};
