import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function ServiceCard({ icon: Icon, name, onPress }) {
  return (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.serviceIcon}>
        <Icon size={20} color="#F97316" />
      </View>
      <Text style={styles.serviceName}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  serviceCard: {
    width: "31%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 90,
  },
  serviceIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#FEF3F2",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
});
