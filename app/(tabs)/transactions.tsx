import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getMyTransactions } from "@/services/transaction.service";
import { Transaction } from "@/services/types";
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        status: status || undefined,
        startDate: startDate ? new Date(startDate.setHours(0, 0, 0, 0)).toISOString() : undefined,
        endDate: endDate ? new Date(endDate.setHours(23, 59, 59, 999)).toISOString() : undefined,
      };
      const response = await getMyTransactions(params);
      if (response.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [status, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const resetFilters = () => {
    setStatus("");
    setStartDate(null);
    setEndDate(null);
  };

  const getStatusConfig = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return { label: "Success", color: "#10b981", bgColor: "#ecfdf5" };
      case "pending":
        return { label: "Pending", color: "#f59e0b", bgColor: "#fffbeb" };
      case "failed":
        return { label: "Failed", color: "#ef4444", bgColor: "#fef2f2" };
      default:
        return { label: status, color: "#64748b", bgColor: "#f8fafc" };
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const status = getStatusConfig(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </ThemedText>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: status.bgColor },
            ]}
          >
            <ThemedText style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.courseTitle}>
          {item.course?.title || "Course"}
        </ThemedText>

        <View style={styles.cardFooter}>
          <View>
            <ThemedText style={styles.label}>Method</ThemedText>
            <ThemedText style={styles.value}>
              {item.paymentMethod.toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.amountContainer}>
            <ThemedText style={styles.label}>Total</ThemedText>
            <ThemedText style={styles.amount}>
              Rp {item.amount.toLocaleString()}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterChip, status === "" && styles.filterChipActive]}
            onPress={() => setStatus("")}
          >
            <ThemedText style={[styles.filterChipText, status === "" && styles.filterChipTextActive]}>All</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, status === "success" && styles.filterChipActive]}
            onPress={() => setStatus("success")}
          >
            <ThemedText style={[styles.filterChipText, status === "success" && styles.filterChipTextActive]}>Success</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, status === "pending" && styles.filterChipActive]}
            onPress={() => setStatus("pending")}
          >
            <ThemedText style={[styles.filterChipText, status === "pending" && styles.filterChipTextActive]}>Pending</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, status === "failed" && styles.filterChipActive]}
            onPress={() => setStatus("failed")}
          >
            <ThemedText style={[styles.filterChipText, status === "failed" && styles.filterChipTextActive]}>Failed</ThemedText>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.dateFilterRow}>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <ThemedText style={styles.dateInputText}>
              {startDate ? startDate.toLocaleDateString('en-US') : 'Start'}
            </ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.dateSeparator}>-</ThemedText>

          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <ThemedText style={styles.dateInputText}>
              {endDate ? endDate.toLocaleDateString('en-US') : 'End'}
            </ThemedText>
          </TouchableOpacity>

          {(status || startDate || endDate) && (
            <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {loading && transactions.length === 0 ? (
        <ActivityIndicator
          size="large"
          color="#3b82f6"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTransactions}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="receipt-long"
                size={64}
                color="#e2e8f0"
              />
              <ThemedText style={styles.emptyText}>
                There is no transaction history yet.
              </ThemedText>
            </View>
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
  listContent: {
    padding: 15,
  },
  filterSection: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  filterScroll: {
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterChipActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: "#64748b",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  dateFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 4,
  },
  dateInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dateInputText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#475569",
    fontFamily: Fonts.regular,
  },
  dateSeparator: {
    marginHorizontal: 10,
    color: "#94a3b8",
    fontFamily: Fonts.regular,
  },
  resetBtn: {
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: "#64748b",
    fontFamily: Fonts.medium,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: "#1e293b",
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  label: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 2,
    fontFamily: Fonts.regular,
  },
  value: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: "#475569",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: "#3b82f6",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    color: "#94a3b8",
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
});
