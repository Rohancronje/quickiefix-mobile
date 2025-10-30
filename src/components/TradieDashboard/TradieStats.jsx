import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function TradieStats({ stats }) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.totalJobs || 0}</Text>
        <Text style={styles.statLabel}>Total Jobs</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.activeJobs || 0}</Text>
        <Text style={styles.statLabel}>Active</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>${stats.totalEarnings || 0}</Text>
        <Text style={styles.statLabel}>Earned</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.rating || "N/A"}</Text>
        <Text style={styles.statLabel}>Rating</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});
