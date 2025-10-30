import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";

export function TradiePreviewCard({ tradie, onPress }) {
  return (
    <TouchableOpacity
      style={styles.tradiePreviewCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.tradiePreviewHeader}>
        <Text style={styles.tradiePreviewName}>{tradie.name}</Text>
        <View style={styles.tradiePreviewRating}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.tradiePreviewRatingText}>{tradie.rating}</Text>
        </View>
      </View>
      <Text style={styles.tradiePreviewService}>{tradie.primaryService}</Text>
      <Text style={styles.tradiePreviewRate}>${tradie.hourlyRate}/hr</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tradiePreviewCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    width: 160,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tradiePreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tradiePreviewName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  tradiePreviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  tradiePreviewRatingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  tradiePreviewService: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  tradiePreviewRate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F97316",
  },
});
