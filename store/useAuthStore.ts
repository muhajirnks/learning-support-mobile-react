import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/services/types";

interface AuthState {
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   isLoaded: boolean;
   setUser: (user: User | null) => void;
   setToken: (token: string | null) => void;
   logout: () => Promise<void>;
   loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
   user: null,
   token: null,
   isAuthenticated: false,
   isLoaded: false,
   setUser: (user) => set({ user, isAuthenticated: !!user }),
   setToken: (token) => set({ token }),
   logout: async () => {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      set({ user: null, token: null, isAuthenticated: false, isLoaded: true });
   },
   loadAuth: async () => {
      try {
         const token = await AsyncStorage.getItem("token");
         const userStr = await AsyncStorage.getItem("user");
         if (token && userStr) {
            set({
               token,
               user: JSON.parse(userStr),
               isAuthenticated: true,
               isLoaded: true,
            });
         } else {
            set({ isLoaded: true });
         }
      } catch (error) {
         console.error("Error loading auth:", error);
         set({ isLoaded: true });
      }
   },
}));
