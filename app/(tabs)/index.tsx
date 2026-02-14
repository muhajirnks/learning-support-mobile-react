import React, { useEffect, useState } from "react";
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   ActivityIndicator,
   Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { getCourses, getUserStats } from "@/services/course.service";
import { Course } from "@/services/types";

export default function DashboardScreen() {
   const [stats, setStats] = useState({
      enrolledCourses: 0,
      completedLessons: 0,
      totalTransactions: 0,
   });
   const [recentCourses, setRecentCourses] = useState<Course[]>([]);
   const [loading, setLoading] = useState(true);
   const { user } = useAuthStore();
   const router = useRouter();

   const fetchDashboardData = async () => {
      try {
         const [statsRes, allCoursesRes] = await Promise.all([
            getUserStats(),
            getCourses({ limit: 3 }),
         ]);

         if (statsRes) {
            const { totalCourses, completedCourses, totalTransactions } =
               statsRes.data;
            setStats({
               enrolledCourses: totalCourses,
               completedLessons: completedCourses,
               totalTransactions: totalTransactions,
            });
         }

         if (allCoursesRes) {
            setRecentCourses(allCoursesRes.data);
         }
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchDashboardData();
   }, []);

   return (
      <ScrollView style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.welcomeText}>
               Halo, {user?.name || "User"}!
            </Text>
            <Text style={styles.subWelcomeText}>
               Semangat belajar hari ini!
            </Text>
         </View>

         <View style={styles.statsContainer}>
            <View style={styles.statBox}>
               <MaterialIcons name="play-lesson" size={24} color="#3b82f6" />
               <Text style={styles.statNumber}>{stats.enrolledCourses}</Text>
               <Text style={styles.statLabel}>Kursus</Text>
            </View>
            <View style={styles.statBox}>
               <MaterialIcons name="check-circle" size={24} color="#10b981" />
               <Text style={styles.statNumber}>{stats.completedLessons}</Text>
               <Text style={styles.statLabel}>Selesai</Text>
            </View>
            <View style={styles.statBox}>
               <MaterialIcons name="payments" size={24} color="#f59e0b" />
               <Text style={styles.statNumber}>{stats.totalTransactions}</Text>
               <Text style={styles.statLabel}>Transaksi</Text>
            </View>
         </View>

         <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kursus Rekomendasi</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
               <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
         </View>

         <View style={styles.recentList}>
            {loading ? (
               <ActivityIndicator color="#3b82f6" />
            ) : (
               recentCourses.map((course) => (
                  <TouchableOpacity
                     key={course._id}
                     style={styles.courseItem}
                     onPress={() =>
                        router.push({
                           pathname: "/course/[courseId]",
                           params: { courseId: course._id },
                        })
                     }
                  >
                     <Image
                        source={{ uri: course.thumbnailUrl }}
                        style={styles.thumbnail}
                     />
                     <View style={styles.courseInfo}>
                        <Text style={styles.courseTitle} numberOfLines={1}>
                           {course.title}
                        </Text>
                        <Text style={styles.instructorText}>
                           {course.instructor?.name || "Instructor"}
                        </Text>
                     </View>
                     <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color="#94a3b8"
                     />
                  </TouchableOpacity>
               ))
            )}
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f8fafc",
   },
   header: {
      padding: 20,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
   },
   welcomeText: {
      fontSize: 24,
      fontWeight: "700",
      color: "#1e293b",
   },
   subWelcomeText: {
      fontSize: 14,
      color: "#64748b",
      marginTop: 4,
   },
   statsContainer: {
      flexDirection: "row",
      padding: 15,
      justifyContent: "space-between",
   },
   statBox: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 16,
      alignItems: "center",
      width: "30%",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
   },
   statNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1e293b",
      marginTop: 8,
   },
   statLabel: {
      fontSize: 12,
      color: "#64748b",
      marginTop: 2,
   },
   sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 10,
      marginBottom: 15,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1e293b",
   },
   seeAllText: {
      color: "#3b82f6",
      fontSize: 14,
      fontWeight: "500",
   },
   recentList: {
      paddingHorizontal: 20,
      paddingBottom: 30,
   },
   courseItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
      elevation: 1,
   },
   thumbnail: {
      width: 50,
      height: 50,
      borderRadius: 8,
   },
   courseInfo: {
      flex: 1,
      marginLeft: 12,
   },
   courseTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: "#1e293b",
   },
   instructorText: {
      fontSize: 13,
      color: "#64748b",
   },
   centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
});
