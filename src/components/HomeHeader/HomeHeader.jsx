import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  MapPin,
  User,
  UserPlus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react-native";

export function HomeHeader({
  location,
  isAuthenticated,
  user,
  isTradie,
  viewMode,
  onToggleViewMode,
  onProfilePress,
  onSignUpPress,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#1378c6" />
          <Text style={styles.locationText}>
            {location ? "Current location" : "Enable location"}
          </Text>
        </View>
        <Text style={styles.greeting}>
          {isAuthenticated
            ? `Hi ${user?.name || user?.first_name || "there"}!`
            : "Welcome to QuickieFix"}
        </Text>
        {/* View mode indicator for tradies */}
        {isTradie && (
          <View style={styles.viewModeIndicator}>
            <Text style={styles.viewModeText}>
              {viewMode === "customer" ? "Customer View" : "Tradie Dashboard"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.headerButtons}>
        {/* View Toggle for Tradies */}
        {isTradie && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={onToggleViewMode}
            activeOpacity={0.8}
          >
            {viewMode === "customer" ? (
              <ToggleLeft size={24} color="#6B7280" />
            ) : (
              <ToggleRight size={24} color="#1378c6" />
            )}
          </TouchableOpacity>
        )}

        {/* Profile/Signup Button */}
        <TouchableOpacity
          style={[
            styles.profileButton,
            !isAuthenticated && styles.signupButton,
          ]}
          onPress={isAuthenticated ? onProfilePress : onSignUpPress}
          activeOpacity={0.8}
        >
          {isAuthenticated ? (
            <User size={24} color="#1378c6" />
          ) : (
            <UserPlus size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  headerContent: {
    flex: 1,
    gap: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#6B7280",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileButton: {
    width: 44,
    height: 44,
    backgroundColor: "#E6F2FF",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1378c6",
  },
  toggleButton: {
    width: 44,
    height: 44,
    backgroundColor: "#F9FAFB",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  signupButton: {
    backgroundColor: "#1378c6",
    borderColor: "#1378c6",
  },
  viewModeIndicator: {
    marginTop: 4,
  },
  viewModeText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});
