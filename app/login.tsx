import React, { useState } from "react";
import {
   View,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   Alert,
   ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { login } from "@/services/auth.service";
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";

export default function LoginScreen() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const handleLogin = async () => {
      if (!email || !password) {
         Alert.alert("Error", "Email and password are required");
         return;
      }

      setLoading(true);
      try {
         await login({ email, password });
         router.replace("/(tabs)");
      } catch (error: any) {
         console.error(error);
         Alert.alert(
            "Login Failed",
            error.response?.data?.message || "An error occurred",
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <ThemedText style={styles.title} type="title">Welcome Back!</ThemedText>
            <ThemedText style={styles.subtitle}>Sign in to continue learning</ThemedText>
         </View>

         <View style={styles.form}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
               style={styles.input}
               placeholder="Enter your email"
               value={email}
               onChangeText={setEmail}
               keyboardType="email-address"
               autoCapitalize="none"
            />

            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
               style={styles.input}
               placeholder="Enter your password"
               value={password}
               onChangeText={setPassword}
               secureTextEntry
            />

            <TouchableOpacity
               style={styles.button}
               onPress={handleLogin}
               disabled={loading}
            >
               {loading ? (
                  <ActivityIndicator color="#fff" />
               ) : (
                  <ThemedText style={styles.buttonText}>Sign In</ThemedText>
               )}
            </TouchableOpacity>

            <View style={styles.footer}>
               <ThemedText style={styles.footerText}>Don't have an account? </ThemedText>
               <Link href="/register" asChild>
                  <TouchableOpacity>
                     <ThemedText style={styles.linkText}>Register Now</ThemedText>
                  </TouchableOpacity>
               </Link>
            </View>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20,
      justifyContent: "center",
   },
   header: {
      marginBottom: 40,
   },
   title: {
      fontSize: 28,
      color: "#1a1a1a",
      marginBottom: 8,
   },
   subtitle: {
      fontSize: 16,
      color: "#666",
   },
   form: {
      gap: 16,
   },
   label: {
      fontSize: 14,
      fontFamily: Fonts.semiBold,
      color: "#333",
      marginBottom: -8,
   },
   input: {
      height: 50,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      backgroundColor: "#f9f9f9",
      fontFamily: Fonts.regular,
   },
   button: {
      height: 50,
      backgroundColor: "#3b82f6",
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
   },
   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: Fonts.bold,
   },
   footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 16,
   },
   footerText: {
      color: "#666",
   },
   linkText: {
      color: "#3b82f6",
      fontFamily: Fonts.bold,
   },
});
