import api from "./api";
import { Category, PaginationResponse } from "./types";

export const getCategories = async (): Promise<
   PaginationResponse<Category>
> => {
   const response = await api.get("/categories", { params: { limit: 100 } });
   return response.data;
};
