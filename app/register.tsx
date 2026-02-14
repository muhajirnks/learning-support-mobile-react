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
         Alert.alert("Error", "Semua field harus diisi");
         return;
      }

      if (password !== confirmPassword) {
         Alert.alert("Error", "Konfirmasi password tidak cocok");
         return;
      }

      setLoading(true);
      try {
         await register({ name, email, password });
         Alert.alert("Berhasil", "Akun berhasil dibuat. Silakan masuk.", [
            { text: "OK", onPress: () => router.replace("/login") },
         ]);
      } catch (error: any) {
         Alert.alert(
            "Registrasi Gagal",
            error.response?.data?.message || "Terjadi kesalahan",
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <ScrollView contentContainerStyle={styles.container}>
         <View style={styles.header}>
            <Text style={styles.title}>Buat Akun</Text>
            <Text style={styles.subtitle}>
               Mulai perjalanan belajarmu sekarang
            </Text>
         </View>

         <View style={styles.form}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
               style={styles.input}
               placeholder="Masukkan nama lengkap"
               value={name}
               onChangeText={setName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
               style={styles.input}
               placeholder="Masukkan email"
               value={email}
               onChangeText={setEmail}
               keyboardType="email-address"
               autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
               style={styles.input}
               placeholder="Masukkan password"
               value={password}
               onChangeText={setPassword}
               secureTextEntry
            />

            <Text style={styles.label}>Konfirmasi Password</Text>
            <TextInput
               style={styles.input}
               placeholder="Ulangi password"
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
                  <Text style={styles.buttonText}>Daftar</Text>
               )}
            </TouchableOpacity>

            <View style={styles.footer}>
               <Text style={styles.footerText}>Sudah punya akun? </Text>
               <Link href="/login" asChild>
                  <TouchableOpacity>
                     <Text style={styles.linkText}>Masuk</Text>
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
