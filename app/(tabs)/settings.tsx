import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";

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
        <ThemedText style={styles.userName}>{user?.name}</ThemedText>
        <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
        <TouchableOpacity style={styles.editButton}>
          <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <ThemedText style={styles.sectionTitle}>Account</ThemedText>
        <MenuItem icon="security" label="Security" />
        <MenuItem icon="notifications-none" label="Notifications" />
        <MenuItem icon="language" label="Language" value="English" />
      </View>

      <View style={styles.menuSection}>
        <ThemedText style={styles.sectionTitle}>Support</ThemedText>
        <MenuItem icon="help-outline" label="Help Center" />
        <MenuItem icon="info-outline" label="About App" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color="#ef4444" />
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
    </ScrollView>
  );
}

function MenuItem({ icon, label, value }: any) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <MaterialIcons name={icon} size={22} color="#475569" />
        <ThemedText style={styles.menuLabel}>{label}</ThemedText>
      </View>
      <View style={styles.menuItemRight}>
        {value && <ThemedText style={styles.menuValue}>{value}</ThemedText>}
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
    fontFamily: Fonts.bold,
    color: "#1e293b",
  },
  userEmail: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontFamily: Fonts.regular,
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
    fontFamily: Fonts.semiBold,
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
    fontFamily: Fonts.bold,
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
    fontFamily: Fonts.medium,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  menuValue: {
    fontSize: 14,
    color: "#94a3b8",
    fontFamily: Fonts.regular,
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
    fontFamily: Fonts.bold,
  },
  version: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
    fontFamily: Fonts.regular,
  },
});
