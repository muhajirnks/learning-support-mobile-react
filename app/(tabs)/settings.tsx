import React from "react";
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   Image,
   ScrollView,
   Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
   const { user, logout } = useAuthStore();
   const router = useRouter();

   const handleLogout = () => {
      Alert.alert("Logout Confirmation", "Are you sure you want to logout?", [
         { text: "Cancel", style: "cancel" },
         {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
               await logout();
               router.replace("/login");
            },
         },
      ]);
   };

   return (
      <ScrollView style={styles.container}>
         <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
               <MaterialIcons name="person" size={40} color="#64748b" />
            </View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <TouchableOpacity style={styles.editButton}>
               <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
         </View>

         <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            <MenuItem icon="security" label="Security" />
            <MenuItem icon="notifications-none" label="Notifications" />
            <MenuItem icon="language" label="Language" value="English" />
         </View>

         <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Support</Text>
            <MenuItem icon="help-outline" label="Help Center" />
            <MenuItem icon="info-outline" label="About App" />
         </View>

         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
         </TouchableOpacity>

         <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
   );
}

function MenuItem({ icon, label, value }: any) {
   return (
      <TouchableOpacity style={styles.menuItem}>
         <View style={styles.menuItemLeft}>
            <MaterialIcons name={icon} size={22} color="#475569" />
            <Text style={styles.menuLabel}>{label}</Text>
         </View>
         <View style={styles.menuItemRight}>
            {value && <Text style={styles.menuValue}>{value}</Text>}
            <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
         </View>
      </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f8fafc",
   },
   profileSection: {
      alignItems: "center",
      padding: 30,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#e2e8f0",
   },
   avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#f1f5f9",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
   },
   userName: {
      fontSize: 20,
      fontWeight: "800",
      color: "#1e293b",
   },
   userEmail: {
      fontSize: 14,
      color: "#64748b",
      marginTop: 4,
   },
   editButton: {
      marginTop: 15,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#3b82f6",
   },
   editButtonText: {
      color: "#3b82f6",
      fontWeight: "600",
      fontSize: 13,
   },
   menuSection: {
      marginTop: 25,
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#e2e8f0",
   },
   sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: "#94a3b8",
      paddingHorizontal: 20,
      paddingTop: 15,
      paddingBottom: 5,
      textTransform: "uppercase",
   },
   menuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
   },
   menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
   },
   menuLabel: {
      fontSize: 15,
      color: "#1e293b",
      fontWeight: "500",
   },
   menuItemRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   menuValue: {
      fontSize: 14,
      color: "#94a3b8",
   },
   logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 30,
      padding: 15,
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#e2e8f0",
   },
   logoutText: {
      color: "#ef4444",
      fontSize: 16,
      fontWeight: "700",
   },
   version: {
      textAlign: "center",
      color: "#94a3b8",
      fontSize: 12,
      marginTop: 20,
      marginBottom: 40,
   },
});
