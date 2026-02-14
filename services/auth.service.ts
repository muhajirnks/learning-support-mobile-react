import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/useAuthStore";
import {
   LoginResponse,
   DataResponse,
   User,
   LoginRequest,
   RegisterRequest,
} from "./types";

export const login = async (data: LoginRequest) => {
   const response = await api.post<LoginResponse>("/auth/login", data);
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

export const register = async (data: RegisterRequest) => {
   const response = await api.post<DataResponse<User>>("/auth/register", data);
   return response.data;
};

export const getProfile = async () => {
   const response = await api.get<DataResponse<User>>("/auth/profile");
   return response.data;
};
