import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginResponse, RegisterResponse, DataResponse, User } from "./types";

export const login = async (data: any): Promise<LoginResponse> => {
   const response = await api.post("/auth/login", data);
   const { token, data: user } = response.data;
   const accessToken = token?.accessToken;

   if (!accessToken || !user) {
      throw new Error("Data login tidak lengkap");
   }

   await AsyncStorage.setItem("token", accessToken);
   await AsyncStorage.setItem("user", JSON.stringify(user));

   useAuthStore.getState().setToken(accessToken);
   useAuthStore.getState().setUser(user);

   return response.data;
};

export const register = async (data: any): Promise<RegisterResponse> => {
   const response = await api.post("/auth/register", data);
   return response.data;
};

export const getProfile = async (): Promise<DataResponse<User>> => {
   const response = await api.get("/auth/profile");
   return response.data;
};
