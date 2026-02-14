import api from "./api";
import { Category, PaginationResponse } from "./types";

export const getCategories = async () => {
   const response = await api.get<PaginationResponse<Category>>("/categories", {
      params: { limit: 100 },
   });
   return response.data;
};
