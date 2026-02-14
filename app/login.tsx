import React, { useState } from "react";
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   Alert,
   ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { login } from "@/services/auth.service";

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
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue learning</Text>
         </View>

         <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
               style={styles.input}
               placeholder="Enter your email"
               value={email}
               onChangeText={setEmail}
               keyboardType="email-address"
               autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
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
                  <Text style={styles.buttonText}>Sign In</Text>
               )}
            </TouchableOpacity>

            <View style={styles.footer}>
               <Text style={styles.footerText}>Don't have an account? </Text>
               <Link href="/register" asChild>
                  <TouchableOpacity>
                     <Text style={styles.linkText}>Register Now</Text>
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
      fontWeight: "800",
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
      fontWeight: "600",
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
      fontWeight: "700",
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
      fontWeight: "700",
   },
});
