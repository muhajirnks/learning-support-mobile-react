import api from "./api";
import { Transaction, PaginationResponse } from "./types";

export const getMyTransactions = async (params?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<PaginationResponse<Transaction>> => {
  const response = await api.get<PaginationResponse<Transaction>>('/transactions/my', { params });
  return response.data;
};
