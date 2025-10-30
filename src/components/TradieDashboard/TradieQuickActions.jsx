import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function TradieQuickActions({ onToggleAvailability, isAvailable }) {
  return (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={[
          styles.quickAction,
          { backgroundColor: isAvailable ? "#EF4444" : "#10B981" },
        ]}
        onPress={onToggleAvailability}
        activeOpacity={0.8}
      >
        <Text style={styles.quickActionText}>
          {isAvailable ? "Go Offline" : "Go Online"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quickActionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  quickAction: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
