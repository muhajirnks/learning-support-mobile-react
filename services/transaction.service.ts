import api from "./api";
import {
   Transaction,
   PaginationResponse,
   CreateTransactionRequest,
   DataResponse,
} from "./types";

export const getMyTransactions = async (params?: {
   status?: string;
   startDate?: string;
   endDate?: string;
}) => {
   const response = await api.get<PaginationResponse<Transaction>>(
      "/transactions/my",
      { params },
   );
   return response.data;
};

export const createTransaction = async (body: CreateTransactionRequest) => {
   const response = await api.post<DataResponse<Transaction>>(
      "/transactions",
      body,
   );
   return response.data;
};
