export interface User {
   id: string;
   name: string;
   email: string;
   role: string;
   avatar?: string;
}

export interface Category {
   _id: string;
   name: string;
   slug: string;
}

export interface Instructor {
   _id: string;
   name: string;
   avatar?: string;
}

export interface Course {
   _id: string;
   title: string;
   description: string;
   instructor: Instructor;
   price: number;
   thumbnailUrl: string;
   goals: string[];
   category: Category;
   rating?: number;
   isPurchased?: boolean;
   transactionStatus?: "pending" | "success" | "failed";
   progressPercentage?: number;
   totalLessons?: number;
   completedLessons?: number;
}

export interface Lesson {
   _id: string;
   course: string;
   title: string;
   content: string;
   videoUrl?: string;
   order: number;
   isCompleted?: boolean;
}

export interface PaginationMeta {
   total: number;
   page: number;
   limit: number;
   lastPage: number;
}

export interface DataResponse<T> {
   message?: string;
   data: T;
}

export interface Transaction {
   _id: string;
   user: string | User;
   course: Course;
   amount: number;
   paymentMethod: string;
   status: "pending" | "success" | "failed";
   createdAt: string;
}

export interface LoginResponse {
   message?: string;
   token: {
      accessToken: string;
   };
   data: User;
}

export interface PaginationResponse<T> {
   message?: string;
   data: T[];
   meta?: PaginationMeta;
}

export interface LoginRequest {
   email: string;
   password: string;
}

export interface RegisterRequest {
   name: string;
   email: string;
   password: string;
}

export interface CreateTransactionRequest {
   course: string;
   paymentMethod: "Manual Transfer";
}

export interface UserStats {
   totalCourses: number;
   completedCourses: number;
   totalTransactions: number;
}
