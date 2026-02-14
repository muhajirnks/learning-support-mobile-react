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
) => {
   const response = await api.get<DataResponse<CourseProgress>>(`/progress/course/${courseId}`);
   return response.data;
};

export const markAsCompleted = async (
   lessonId: string,
) => {
   const response = await api.post<DataResponse<null>>(`/progress/lesson/${lessonId}/complete`);
   return response.data;
};

export const getLessonsByCourse = async (
   courseId: string,
) => {
   const response = await api.get<PaginationResponse<Lesson>>("/lessons", {
      params: {
         course: courseId,
         limit: 100,
         sort: "order",
         direction: "asc",
      },
   });
   return response.data;
};
