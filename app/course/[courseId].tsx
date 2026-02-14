import React, { useEffect, useState } from "react";
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   Image,
   TouchableOpacity,
   ActivityIndicator,
   Alert,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { getCourseById } from "@/services/course.service";
import { getLessonsByCourse } from "@/services/lesson.service";
import { Course, Lesson } from "@/services/types";
import api from "@/services/api";
import { createTransaction } from "@/services/transaction.service";

export default function CourseDetailScreen() {
   const { courseId } = useLocalSearchParams<{ courseId: string }>();
   const [course, setCourse] = useState<Course | null>(null);
   const [lessons, setLessons] = useState<Lesson[]>([]);
   const [loading, setLoading] = useState(true);
   const [enrolling, setEnrolling] = useState(false);
   const { isAuthenticated } = useAuthStore();
   const router = useRouter();

   const fetchCourseDetail = async () => {
      if (!courseId) return;
      try {
         const [courseRes, lessonsRes] = await Promise.all([
            getCourseById(courseId),
            getLessonsByCourse(courseId),
         ]);

         if (courseRes) setCourse(courseRes.data);
         if (lessonsRes) setLessons(lessonsRes.data);
      } catch (error) {
         console.error(error);
         Alert.alert("Error", "Gagal memuat detail kursus");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchCourseDetail();
   }, [courseId]);

   const handleEnroll = async () => {
      if (!isAuthenticated) {
         router.push("/login");
         return;
      }

      if (course?.transactionStatus === "success") {
         router.push({
            pathname: "/learning/[courseId]",
            params: { courseId: courseId as string },
         });
         return;
      }

      if (course?.transactionStatus === "pending") {
         Alert.alert(
            "Info",
            "Pendaftaran Anda sedang menunggu konfirmasi admin.",
         );
         return;
      }

      setEnrolling(true);
      try {
         createTransaction({
            course: courseId,
            paymentMethod: "Manual Transfer",
         });
         Alert.alert("Sukses", "Berhasil mendaftar kursus!", [
            { text: "OK", onPress: () => fetchCourseDetail() },
         ]);
      } catch (error: any) {
         console.error(error);
         Alert.alert(
            "Gagal",
            error.response?.data?.message || "Terjadi kesalahan saat mendaftar",
         );
      } finally {
         setEnrolling(false);
      }
   };

   const getEnrollButtonText = () => {
      if (enrolling) return "Memproses...";
      if (course?.transactionStatus === "pending") return "Menunggu Konfirmasi";
      if (course?.transactionStatus === "success") return "Buka Kursus";
      return "Daftar Sekarang";
   };

   if (loading) {
      return (
         <View style={styles.centered}>
            <ActivityIndicator size="large" color="#3b82f6" />
         </View>
      );
   }

   if (!course) {
      return (
         <View style={styles.centered}>
            <Text>Kursus tidak ditemukan</Text>
         </View>
      );
   }

   return (
      <View style={styles.container}>
         <Stack.Screen options={{ title: course.title }} />
         <ScrollView>
            <Image
               source={{ uri: course.thumbnailUrl }}
               style={styles.banner}
            />

            <View style={styles.content}>
               <Text style={styles.title}>{course.title}</Text>

               <View style={styles.instructorRow}>
                  <MaterialIcons name="person" size={20} color="#64748b" />
                  <Text style={styles.instructorName}>
                     Oleh: {course.instructor?.name || "Instructor"}
                  </Text>
               </View>

               <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Harga Kursus</Text>
                  <Text style={styles.priceValue}>
                     {course.price === 0
                        ? "Gratis"
                        : `Rp ${course.price.toLocaleString()}`}
                  </Text>
               </View>

               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tentang Kursus</Text>
                  <Text style={styles.description}>{course.description}</Text>
               </View>

               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                     Apa yang akan dipelajari
                  </Text>
                  {course.goals?.map((goal, index) => (
                     <View key={index} style={styles.goalItem}>
                        <MaterialIcons name="check" size={18} color="#10b981" />
                        <Text style={styles.goalText}>{goal}</Text>
                     </View>
                  ))}
               </View>

               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                     Kurikulum ({lessons.length} Pelajaran)
                  </Text>
                  {lessons.map((lesson, index) => (
                     <View key={lesson._id} style={styles.lessonItem}>
                        <Text style={styles.lessonNumber}>{index + 1}</Text>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                        <MaterialIcons name="lock" size={18} color="#94a3b8" />
                     </View>
                  ))}
               </View>
            </View>
         </ScrollView>

         <View style={styles.footer}>
            <TouchableOpacity
               style={[
                  styles.enrollButton,
                  course.transactionStatus === "pending" &&
                     styles.pendingButton,
                  course.transactionStatus === "success" &&
                     styles.successButton,
               ]}
               onPress={handleEnroll}
               disabled={enrolling}
            >
               <Text style={styles.enrollButtonText}>
                  {getEnrollButtonText()}
               </Text>
            </TouchableOpacity>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
   banner: {
      width: "100%",
      height: 200,
      backgroundColor: "#f1f5f9",
   },
   content: {
      padding: 20,
   },
   title: {
      fontSize: 24,
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: 8,
   },
   instructorRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
   },
   instructorName: {
      marginLeft: 6,
      color: "#64748b",
      fontSize: 14,
   },
   priceContainer: {
      backgroundColor: "#f8fafc",
      padding: 15,
      borderRadius: 12,
      marginBottom: 20,
   },
   priceLabel: {
      fontSize: 12,
      color: "#64748b",
      marginBottom: 4,
   },
   priceValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#3b82f6",
   },
   section: {
      marginBottom: 25,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: 12,
   },
   description: {
      fontSize: 15,
      color: "#475569",
      lineHeight: 24,
   },
   goalItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
   },
   goalText: {
      marginLeft: 10,
      fontSize: 14,
      color: "#475569",
   },
   lessonItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
   },
   lessonNumber: {
      width: 24,
      fontSize: 14,
      color: "#94a3b8",
      fontWeight: "600",
   },
   lessonTitle: {
      flex: 1,
      fontSize: 14,
      color: "#1e293b",
   },
   footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: "#f1f5f9",
   },
   enrollButton: {
      backgroundColor: "#3b82f6",
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: "center",
   },
   pendingButton: {
      backgroundColor: "#f59e0b",
   },
   successButton: {
      backgroundColor: "#10b981",
   },
   enrollButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
});
