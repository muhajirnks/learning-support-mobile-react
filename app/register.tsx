import React, { useState } from "react";
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   Alert,
   ActivityIndicator,
   ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { register } from "@/services/auth.service";

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
               Start your learning journey today
            </Text>
         </View>

         <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
               style={styles.input}
               placeholder="Enter your full name"
               value={name}
               onChangeText={setName}
            />

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

            <Text style={styles.label}>Confirm Password</Text>
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
                  <Text style={styles.buttonText}>Register</Text>
               )}
            </TouchableOpacity>

            <View style={styles.footer}>
               <Text style={styles.footerText}>Already have an account? </Text>
               <Link href="/login" asChild>
                  <TouchableOpacity>
                     <Text style={styles.linkText}>Sign In</Text>
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
