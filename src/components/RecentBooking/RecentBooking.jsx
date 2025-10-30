import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "#10B981";
    case "in_progress":
      return "#F59E0B";
    case "pending":
      return "#6B7280";
    case "cancelled":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export function RecentBooking({ service, tradie, status, date, onPress }) {
  return (
    <TouchableOpacity
      style={styles.recentBooking}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.bookingContent}>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingService}>{service}</Text>
          <Text style={styles.bookingTradie}>{tradie}</Text>
          <Text style={styles.bookingDate}>{date}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(status) },
          ]}
        >
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recentBooking: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bookingContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingInfo: {
    flex: 1,
  },
  bookingService: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  bookingTradie: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  bookingDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
