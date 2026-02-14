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
               title: "Find Courses",
               tabBarLabel: "Explore",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons size={28} name="search" color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="my-courses"
            options={{
               title: "My Courses",
               tabBarLabel: "Courses",
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
               title: "Transaction History",
               tabBarLabel: "Transactions",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons size={28} name="history" color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="settings"
            options={{
               title: "Settings",
               tabBarLabel: "Settings",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons size={28} name="person" color={color} />
               ),
            }}
         />
      </Tabs>
   );
}
