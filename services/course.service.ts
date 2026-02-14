import api from "./api";
import { Course, DataResponse, PaginationResponse, UserStats } from "./types";

export const getCourses = async (params?: {
   category?: string;
   search?: string;
   page?: number;
   limit?: number;
}) => {
   const response = await api.get<PaginationResponse<Course>>("/courses", {
      params,
   });
   return response.data;
};

export const getCourseById = async (id: string) => {
   const response = await api.get<DataResponse<Course>>(`/courses/${id}`);
   return response.data;
};

export const getMyCourses = async (params?: {
   search?: string;
   page?: number;
   limit?: number;
}) => {
   const response = await api.get<PaginationResponse<Course>>("/courses/my", {
      params,
   });
   return response.data;
};

export const getUserStats = async () => {
   const response = await api.get<DataResponse<UserStats>>("/courses/stats");
   return response.data;
};
