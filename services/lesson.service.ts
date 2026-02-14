import api from "./api";
import { Lesson, DataResponse, PaginationResponse } from "./types";

export interface CourseProgress {
   courseId: string;
   percentage: number;
   totalLessons: number;
   completedLessons: number;
   lessons: Lesson[];
}

export const getCourseProgress = async (
   courseId: string,
): Promise<DataResponse<CourseProgress>> => {
   const response = await api.get(`/progress/course/${courseId}`);
   return response.data;
};

export const markAsCompleted = async (
   lessonId: string,
): Promise<DataResponse<any>> => {
   const response = await api.post(`/progress/lesson/${lessonId}/complete`);
   return response.data;
};

export const getLessonsByCourse = async (
   courseId: string,
): Promise<PaginationResponse<Lesson>> => {
   const response = await api.get("/lessons", {
      params: {
         course: courseId,
         limit: 100,
         sort: "order",
         direction: "asc",
      },
   });
   return response.data;
};
