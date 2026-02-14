import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = "http://192.168.18.202:3000/api/v1"; // Sesuaikan dengan IP server backend Anda

const api = axios.create({
   baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
   const token = await AsyncStorage.getItem("token");
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

api.interceptors.response.use(
   (response) => response,
   async (error) => {
      if (error.response?.status === 401) {
         // Jika unauthorized, logout user
         await useAuthStore.getState().logout();
      }
      return Promise.reject(error);
   },
);

export default api;
