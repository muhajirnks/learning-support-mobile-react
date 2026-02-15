import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import {
   StyleSheet,
   ScrollView,
   ActivityIndicator,
   TouchableOpacity,
   View,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";
import {
   getCourseProgress,
   markAsCompleted,
   CourseProgress,
} from "@/services/lesson.service";
import { getCourseById } from "@/services/course.service";
import { Course, Lesson } from "@/services/types";

export default function LearningScreen() {
   const { courseId } = useLocalSearchParams<{ courseId: string }>();
   const [progress, setProgress] = useState<CourseProgress | null>(null);
   const [course, setCourse] = useState<Course | null>(null);
   const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
   const [loading, setLoading] = useState(true);
   const router = useRouter();

   const fetchData = async () => {
      if (!courseId) return;
      try {
         const [progressData, courseRes] = await Promise.all([
            getCourseProgress(courseId),
            getCourseById(courseId),
         ]);

         if (progressData) {
            setProgress(progressData.data);
            if (!activeLesson && progressData.data.lessons.length > 0) {
               setActiveLesson(progressData.data.lessons[0]);
            } else if (activeLesson) {
               const updated = progressData.data.lessons.find(
                  (l) => l._id === activeLesson._id,
               );
               if (updated) setActiveLesson(updated);
            }
         }

         if (courseRes) {
            setCourse(courseRes.data);
         }
      } catch (error) {
         console.error("Error fetching learning data:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, [courseId]);

   const handleComplete = async () => {
      if (!activeLesson) return;
      const res = await markAsCompleted(activeLesson._id);
      if (res) {
         fetchData();
      }
   };

   if (loading) {
      return (
         <View style={styles.centered}>
            <ActivityIndicator size="large" color="#3b82f6" />
         </View>
      );
   }

   if (!progress) {
      return (
         <View style={styles.centered}>
            <MaterialIcons name="error-outline" size={48} color="#ef4444" />
            <ThemedText style={styles.errorText}>
               Course not found or failed to load progress.
            </ThemedText>
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <ThemedText style={styles.backButtonText}>Back</ThemedText>
            </TouchableOpacity>
         </View>
      );
   }

   return (
      <View style={styles.container}>
         <Stack.Screen options={{ title: course?.title || "Learning" }} />

         <View style={styles.tabBar}>
            <View style={styles.progressHeader}>
               <View style={styles.progressInfo}>
                  <ThemedText style={styles.progressLabel}>Learning Progress</ThemedText>
                  <ThemedText style={styles.progressValue}>
                     {progress.percentage}%
                  </ThemedText>
               </View>
               <View style={styles.progressContainer}>
                  <View
                     style={[
                        styles.progressBar,
                        { width: `${progress.percentage}%` },
                     ]}
                  />
               </View>
               <ThemedText style={styles.lessonCount}>
                  {progress.completedLessons} of {progress.totalLessons}{" "}
                  lessons completed
               </ThemedText>
            </View>
            <ScrollView
               horizontal
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.tabContent}
            >
               {progress.lessons.map((lesson, index) => (
                  <TouchableOpacity
                     key={lesson._id}
                     style={[
                        styles.tabItem,
                        activeLesson?._id === lesson._id &&
                           styles.tabItemActive,
                     ]}
                     onPress={() => setActiveLesson(lesson)}
                  >
                     <View style={styles.tabIcon}>
                        {lesson.isCompleted ? (
                           <Ionicons
                              name="checkmark-circle"
                              size={16}
                              color={
                                 activeLesson?._id === lesson._id
                                    ? "#fff"
                                    : "#10b981"
                              }
                           />
                        ) : (
                           <View
                              style={[
                                 styles.dot,
                                 activeLesson?._id === lesson._id &&
                                    styles.dotActive,
                              ]}
                           />
                        )}
                     </View>
                     <ThemedText
                        style={[
                           styles.tabText,
                           activeLesson?._id === lesson._id &&
                              styles.tabTextActive,
                        ]}
                        numberOfLines={1}
                     >
                        L{index + 1}: {lesson.title}
                     </ThemedText>
                  </TouchableOpacity>
               ))}
            </ScrollView>
         </View>

         <ScrollView
            style={styles.mainContent}
            contentContainerStyle={styles.mainScrollContent}
         >
            {activeLesson ? (
               <View style={styles.lessonContent}>
                  <ThemedText style={styles.lessonTitle}>{activeLesson.title}</ThemedText>
                  <View style={styles.videoPlaceholder}>
                     <MaterialIcons
                        name="play-circle-filled"
                        size={64}
                        color="#3b82f6"
                     />
                     <ThemedText style={styles.videoText}>
                        Video Player Placeholder
                     </ThemedText>
                  </View>
                  <ThemedText style={styles.description}>{activeLesson.content}</ThemedText>
               </View>
            ) : (
               <View style={styles.noActiveLesson}>
                  <ThemedText>Select a lesson to start learning</ThemedText>
               </View>
            )}
         </ScrollView>

         <View style={styles.footer}>
            <TouchableOpacity
               style={[
                  styles.completeButton,
                  activeLesson?.isCompleted && styles.completedButton,
               ]}
               onPress={handleComplete}
               disabled={!activeLesson || activeLesson.isCompleted}
            >
               <MaterialIcons
                  name={
                     activeLesson?.isCompleted
                        ? "check-circle"
                        : "radio-button-unchecked"
                  }
                  size={20}
                  color="#fff"
               />
               <ThemedText style={styles.completeButtonText}>
                  {activeLesson?.isCompleted ? "Completed" : "Mark as Completed"}
               </ThemedText>
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
      padding: 20,
   },
   tabBar: {
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
   },
   progressHeader: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
   },
   progressInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
   },
   progressLabel: {
      fontSize: 14,
      fontFamily: Fonts.semiBold,
      color: "#1e293b",
   },
   progressValue: {
      fontSize: 14,
      fontFamily: Fonts.bold,
      color: "#3b82f6",
   },
   progressContainer: {
      height: 6,
      backgroundColor: "#f1f5f9",
      borderRadius: 3,
      overflow: "hidden",
      marginBottom: 8,
   },
   progressBar: {
      height: "100%",
      backgroundColor: "#3b82f6",
   },
   lessonCount: {
      fontSize: 12,
      color: "#64748b",
      fontFamily: Fonts.regular,
   },
   tabContent: {
      paddingHorizontal: 15,
      paddingVertical: 12,
   },
   tabItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "#f8fafc",
      marginRight: 10,
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   tabItemActive: {
      backgroundColor: "#3b82f6",
      borderColor: "#3b82f6",
   },
   tabIcon: {
      marginRight: 6,
   },
   dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#94a3b8",
   },
   dotActive: {
      backgroundColor: "#fff",
   },
   tabText: {
      fontSize: 13,
      color: "#64748b",
      fontFamily: Fonts.medium,
      maxWidth: 150,
   },
   tabTextActive: {
      color: "#fff",
   },
   mainContent: {
      flex: 1,
   },
   mainScrollContent: {
      paddingBottom: 30,
   },
   lessonContent: {
      padding: 20,
   },
   lessonTitle: {
      fontSize: 22,
      fontFamily: Fonts.bold,
      color: "#1e293b",
      marginBottom: 20,
   },
   videoPlaceholder: {
      width: "100%",
      aspectRatio: 16 / 9,
      backgroundColor: "#f1f5f9",
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 25,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderStyle: "dashed",
   },
   videoText: {
      marginTop: 10,
      color: "#64748b",
      fontSize: 14,
      fontFamily: Fonts.regular,
   },
   description: {
      fontSize: 16,
      lineHeight: 26,
      color: "#475569",
      fontFamily: Fonts.regular,
   },
   noActiveLesson: {
      padding: 40,
      alignItems: "center",
   },
   footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: "#f1f5f9",
      backgroundColor: "#fff",
   },
   completeButton: {
      backgroundColor: "#3b82f6",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 15,
      borderRadius: 12,
   },
   completedButton: {
      backgroundColor: "#10b981",
   },
   completeButtonText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: Fonts.semiBold,
      marginLeft: 10,
   },
   errorText: {
      marginTop: 15,
      fontSize: 16,
      color: "#64748b",
      textAlign: "center",
      marginBottom: 20,
      fontFamily: Fonts.regular,
   },
   backButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: "#3b82f6",
      borderRadius: 8,
   },
   backButtonText: {
      color: "#fff",
      fontFamily: Fonts.semiBold,
   },
});
