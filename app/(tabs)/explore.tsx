import React, { useEffect, useState } from "react";
import {
   View,
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
import { getCourses } from "@/services/course.service";
import { getCategories } from "@/services/category.service";
import { Course, Category } from "@/services/types";
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";

export default function ExploreScreen() {
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

   const fetchCourses = async (pageNum = 1, isLoadMore = false) => {
      if (pageNum === 1) {
         setLoading(true);
      } else {
         setLoadingMore(true);
      }

      try {
         const response = await getCourses({
            search,
            category: selectedCategory || undefined,
            page: pageNum,
            limit: 10,
         });

         if (response) {
            const newData = response.data;
            const pagination = response.meta;

            if (isLoadMore) {
               setCourses((prev) => [...prev, ...newData]);
               setPage(pageNum);
            } else {
               setCourses(newData);
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
         fetchCourses(1, false);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
   }, [search, selectedCategory]);

   const handleLoadMore = () => {
      if (!loading && !loadingMore && hasMore && courses.length > 0) {
         fetchCourses(page + 1, true);
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
            <ThemedText
               style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
               ]}
            >
               {category.name}
            </ThemedText>
         </TouchableOpacity>
      );
   };

   const renderItem = ({ item }: { item: Course }) => (
      <TouchableOpacity
         style={styles.courseCard}
         onPress={() =>
            router.push({
               pathname: "/course/[courseId]",
               params: { courseId: item._id },
            })
         }
      >
         <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
         <View style={styles.courseInfo}>
            <ThemedText style={styles.courseTitle} numberOfLines={2}>
               {item.title}
            </ThemedText>
            <ThemedText style={styles.instructor}>
               {item.instructor}
            </ThemedText>
            <View style={styles.priceRow}>
               <ThemedText style={styles.price}>
                  {item.price === 0
                     ? "Free"
                     : `Rp ${item.price.toLocaleString()}`}
               </ThemedText>
               <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={16} color="#f59e0b" />
                  <ThemedText style={styles.ratingText}>{item.rating || "4.5"}</ThemedText>
               </View>
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
               placeholder="Search interesting courses..."
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
                  <ThemedText
                     style={[
                        styles.categoryText,
                        !selectedCategory && styles.categoryTextSelected,
                     ]}
                  >
                     All
                  </ThemedText>
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
                        name="search-off"
                        size={64}
                        color="#e2e8f0"
                     />
                     <ThemedText style={styles.emptyText}>
                        Didn't find a suitable course.
                     </ThemedText>
                  </View>
               }
               onRefresh={() => fetchCourses(1, false)}
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
      fontFamily: Fonts.medium,
   },
   categoryTextSelected: {
      color: "#fff",
   },
   searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
      color: "#1e293b",
      fontFamily: Fonts.regular,
   },
   listContent: {
      padding: 15,
      paddingTop: 0,
   },
   courseCard: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 12,
      marginBottom: 15,
      overflow: "hidden",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
   },
   thumbnail: {
      width: 100,
      height: 100,
      backgroundColor: "#f1f5f9",
   },
   courseInfo: {
      flex: 1,
      padding: 12,
      justifyContent: "space-between",
   },
   courseTitle: {
      fontSize: 15,
      fontFamily: Fonts.bold,
      color: "#1e293b",
      lineHeight: 20,
   },
   instructor: {
      fontSize: 13,
      color: "#64748b",
      marginTop: 2,
   },
   priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
   },
   price: {
      fontSize: 14,
      fontFamily: Fonts.bold,
      color: "#3b82f6",
   },
   ratingRow: {
      flexDirection: "row",
      alignItems: "center",
   },
   ratingText: {
      fontSize: 12,
      fontFamily: Fonts.semiBold,
      color: "#f59e0b",
      marginLeft: 4,
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
