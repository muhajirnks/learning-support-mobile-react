import React, { useEffect, useState } from "react";
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   TouchableOpacity,
   ActivityIndicator,
   TextInput,
   ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getMyCourses } from "@/services/course.service";
import { getCategories } from "@/services/category.service";
import { Course, Category } from "@/services/types";

export default function MyCoursesScreen() {
   const [courses, setCourses] = useState<Course[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);
   const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null,
   );
   const [loading, setLoading] = useState(false);
   const [loadingMore, setLoadingMore] = useState(false);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [search, setSearch] = useState("");
   const router = useRouter();

   const fetchCategories = async () => {
      try {
         const response = await getCategories();
         if (response) {
            setCategories(response.data);
         }
      } catch (error) {
         console.error("Error fetching categories:", error);
      }
   };

   const fetchMyCourses = async (pageNum = 1, isLoadMore = false) => {
      if (pageNum === 1) {
         setLoading(true);
      } else {
         setLoadingMore(true);
      }

      try {
         const response = await getMyCourses({
            search,
            page: pageNum,
            limit: 10,
         });

         if (response) {
            const newData = response.data;
            const pagination = response.meta;

            // Filter by category client-side if needed, but better if API supports it
            // For now, let's assume API might not support category on /my, or we handle it here
            let filteredData = newData;
            if (selectedCategory) {
               filteredData = newData.filter(
                  (c) => c.category?._id === selectedCategory,
               );
            }

            if (isLoadMore) {
               setCourses((prev) => [...prev, ...filteredData]);
               setPage(pageNum);
            } else {
               setCourses(filteredData);
               setPage(1);
            }

            if (pagination) {
               setHasMore(pagination.page < pagination.lastPage);
            } else {
               setHasMore(newData.length === 10);
            }
         }
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
         setLoadingMore(false);
      }
   };

   useEffect(() => {
      fetchCategories();
   }, []);

   useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
         setHasMore(true);
         fetchMyCourses(1, false);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
   }, [search, selectedCategory]);

   const handleLoadMore = () => {
      if (!loading && !loadingMore && hasMore && courses.length > 0) {
         fetchMyCourses(page + 1, true);
      }
   };

   const renderCategoryItem = (category: Category) => {
      const isSelected = selectedCategory === category._id;
      return (
         <TouchableOpacity
            key={category._id}
            style={[
               styles.categoryChip,
               isSelected && styles.categoryChipSelected,
            ]}
            onPress={() =>
               setSelectedCategory(isSelected ? null : category._id)
            }
         >
            <Text
               style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
               ]}
            >
               {category.name}
            </Text>
         </TouchableOpacity>
      );
   };

   const renderItem = ({ item }: { item: Course }) => (
      <TouchableOpacity
         style={styles.courseCard}
         onPress={() =>
            router.push({
               pathname: "/learning/[courseId]",
               params: { courseId: item._id },
            })
         }
      >
         <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
         <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={2}>
               {item.title}
            </Text>
            <Text style={styles.instructor}>
               {item.instructor?.name || "Instructor"}
            </Text>
            <View style={styles.progressContainer}>
               <View style={styles.progressBar}>
                  <View
                     style={[
                        styles.progressFill,
                        { width: `${item.progressPercentage || 0}%` },
                     ]}
                  />
               </View>
               <Text style={styles.progressText}>
                  {item.progressPercentage || 0}%
               </Text>
            </View>
         </View>
      </TouchableOpacity>
   );

   return (
      <View style={styles.container}>
         <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#94a3b8" />
            <TextInput
               style={styles.searchInput}
               placeholder="Cari kursus saya..."
               value={search}
               onChangeText={setSearch}
            />
         </View>

         <View style={styles.categoriesWrapper}>
            <ScrollView
               horizontal
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.categoriesContainer}
            >
               <TouchableOpacity
                  style={[
                     styles.categoryChip,
                     !selectedCategory && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(null)}
               >
                  <Text
                     style={[
                        styles.categoryText,
                        !selectedCategory && styles.categoryTextSelected,
                     ]}
                  >
                     Semua
                  </Text>
               </TouchableOpacity>
               {categories.map(renderCategoryItem)}
            </ScrollView>
         </View>

         {loading && courses.length === 0 ? (
            <ActivityIndicator
               size="large"
               color="#3b82f6"
               style={{ marginTop: 50 }}
            />
         ) : (
            <FlatList
               data={courses}
               renderItem={renderItem}
               keyExtractor={(item) => item._id}
               contentContainerStyle={styles.listContent}
               ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                     <MaterialIcons
                        name="play-circle-outline"
                        size={64}
                        color="#e2e8f0"
                     />
                     <Text style={styles.emptyText}>
                        Belum ada kursus yang diambil.
                     </Text>
                  </View>
               }
               onRefresh={() => fetchMyCourses(1, false)}
               refreshing={loading}
               onEndReached={handleLoadMore}
               onEndReachedThreshold={0.5}
               ListFooterComponent={
                  loadingMore ? (
                     <ActivityIndicator
                        size="small"
                        color="#3b82f6"
                        style={{ marginVertical: 20 }}
                     />
                  ) : null
               }
            />
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f8fafc",
   },
   searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      margin: 15,
      paddingHorizontal: 15,
      height: 45,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e2e8f0",
   },
   categoriesWrapper: {
      marginBottom: 10,
   },
   categoriesContainer: {
      paddingHorizontal: 15,
      paddingBottom: 5,
   },
   categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      marginRight: 10,
   },
   categoryChipSelected: {
      backgroundColor: "#3b82f6",
      borderColor: "#3b82f6",
   },
   categoryText: {
      fontSize: 13,
      color: "#64748b",
      fontWeight: "500",
   },
   categoryTextSelected: {
      color: "#fff",
   },
   searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
      color: "#1e293b",
   },
   listContent: {
      padding: 15,
      paddingTop: 0,
   },
   courseCard: {
      backgroundColor: "#fff",
      borderRadius: 16,
      marginBottom: 15,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      flexDirection: "row",
      elevation: 1,
   },
   thumbnail: {
      width: 120,
      height: 90,
      backgroundColor: "#f1f5f9",
   },
   courseInfo: {
      flex: 1,
      padding: 12,
      justifyContent: "center",
   },
   courseTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: "#1e293b",
      lineHeight: 20,
   },
   instructor: {
      fontSize: 13,
      color: "#64748b",
      marginTop: 2,
      marginBottom: 8,
   },
   progressContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: "#f1f5f9",
      borderRadius: 3,
      overflow: "hidden",
   },
   progressFill: {
      height: "100%",
      backgroundColor: "#10b981",
   },
   progressText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#64748b",
      marginLeft: 8,
      width: 35,
   },
   emptyContainer: {
      alignItems: "center",
      marginTop: 100,
   },
   emptyText: {
      marginTop: 15,
      fontSize: 15,
      color: "#94a3b8",
      textAlign: "center",
   },
});
