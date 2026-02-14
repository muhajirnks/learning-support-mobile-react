import api from "./api";
import { Course, DataResponse, PaginationResponse } from "./types";

export const getCourses = async (params?: {
   category?: string;
   search?: string;
   page?: number;
   limit?: number;
}): Promise<PaginationResponse<Course>> => {
   const response = await api.get("/courses", { params });
   return response.data;
};

export const getCourseById = async (
   id: string,
): Promise<DataResponse<Course>> => {
   const response = await api.get(`/courses/${id}`);
   return response.data;
};

export const getMyCourses = async (params?: {
   search?: string;
   page?: number;
   limit?: number;
}): Promise<PaginationResponse<Course>> => {
   const response = await api.get("/courses/my", { params });
   return response.data;
};

export const getUserStats = async (): Promise<
   DataResponse<{
      totalCourses: number;
      completedCourses: number;
      totalTransactions: number;
   }>
> => {
   const response = await api.get("/courses/stats");
   return response.data;
};
