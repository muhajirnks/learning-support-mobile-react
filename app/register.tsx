import React, { useState } from "react";
import {
   View,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   Alert,
   ActivityIndicator,
   ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { register } from "@/services/auth.service";
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";

export default function RegisterScreen() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const handleRegister = async () => {
      if (!name || !email || !password || !confirmPassword) {
         Alert.alert("Error", "All fields are required");
         return;
      }

      if (password !== confirmPassword) {
         Alert.alert("Error", "Passwords do not match");
         return;
      }

      setLoading(true);
      try {
         await register({ name, email, password });
         Alert.alert("Success", "Account created successfully. Please sign in.", [
            { text: "OK", onPress: () => router.replace("/login") },
         ]);
      } catch (error: any) {
         Alert.alert(
            "Registration Failed",
            error.response?.data?.message || "An error occurred",
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <ScrollView contentContainerStyle={styles.container}>
         <View style={styles.header}>
            <ThemedText style={styles.title} type="title">Create Account</ThemedText>
            <ThemedText style={styles.subtitle}>
               Start your learning journey today
            </ThemedText>
         </View>

         <View style={styles.form}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
               style={styles.input}
               placeholder="Enter your full name"
               value={name}
               onChangeText={setName}
            />

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

            <ThemedText style={styles.label}>Confirm Password</ThemedText>
            <TextInput
               style={styles.input}
               placeholder="Repeat your password"
               value={confirmPassword}
               onChangeText={setConfirmPassword}
               secureTextEntry
            />

            <TouchableOpacity
               style={styles.button}
               onPress={handleRegister}
               disabled={loading}
            >
               {loading ? (
                  <ActivityIndicator color="#fff" />
               ) : (
                  <ThemedText style={styles.buttonText}>Register</ThemedText>
               )}
            </TouchableOpacity>

            <View style={styles.footer}>
               <ThemedText style={styles.footerText}>Already have an account? </ThemedText>
               <Link href="/login" asChild>
                  <TouchableOpacity>
                     <ThemedText style={styles.linkText}>Sign In</ThemedText>
                  </TouchableOpacity>
               </Link>
            </View>
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flexGrow: 1,
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
