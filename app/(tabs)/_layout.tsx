import { Tabs } from "expo-router";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function TabLayout() {
   const colorScheme = useColorScheme();

   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: true,
            tabBarStyle: {
               height: 60,
               paddingBottom: 10,
            },
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: "Dashboard",
               tabBarLabel: "Home",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons size={28} name="dashboard" color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="explore"
            options={{
               title: "Cari Kursus",
               tabBarLabel: "Explore",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons size={28} name="search" color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="my-courses"
            options={{
               title: "Kursus Saya",
               tabBarLabel: "Kursus",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons
                     size={28}
                     name="play-circle-fill"
                     color={color}
                  />
               ),
            }}
         />
         <Tabs.Screen
            name="transactions"
            options={{
               title: "Riwayat Transaksi",
               tabBarLabel: "Transaksi",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons size={28} name="history" color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="settings"
            options={{
               title: "Pengaturan",
               tabBarLabel: "Settings",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons size={28} name="person" color={color} />
               ),
            }}
         />
      </Tabs>
   );
}
