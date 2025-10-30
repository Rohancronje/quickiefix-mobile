import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Plus, Users } from "lucide-react-native";
import { ServiceCard } from "@/components/ServiceCard/ServiceCard";
import { RecentBooking } from "@/components/RecentBooking/RecentBooking";
import { TradiePreviewCard } from "@/components/TradiePreviewCard/TradiePreviewCard";

export function CustomerView({
  insets,
  services,
  recentBookings,
  featuredTradies,
  isAuthenticated,
  user,
  location,
  handleServicePress,
  handleBookingPress,
  handleTradiePress,
  handleSeeAllTradies,
}) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Services Grid */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              name={service.name}
              onPress={() => handleServicePress(service.id, service.name)}
            />
          ))}
        </View>
      </View>

      {/* Emergency Button */}
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={() => handleServicePress(null, "Emergency")}
        activeOpacity={0.8}
      >
        <View style={styles.emergencyContent}>
          <Text style={styles.emergencyTitle}>Emergency Service</Text>
          <Text style={styles.emergencySubtitle}>Available 24/7</Text>
        </View>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* See Tradies Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Rated Tradies</Text>
          <TouchableOpacity onPress={handleSeeAllTradies} activeOpacity={0.8}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {featuredTradies.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tradiesPreviewContainer}
          >
            {featuredTradies.map((tradie) => (
              <TradiePreviewCard
                key={tradie.id}
                tradie={tradie}
                onPress={() => handleTradiePress(tradie.id)}
              />
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity
            style={styles.browseTradiesButton}
            onPress={handleSeeAllTradies}
            activeOpacity={0.8}
          >
            <Users size={20} color="#F97316" />
            <Text style={styles.browseTradiesText}>Browse All Tradies</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Recent Bookings */}
      {isAuthenticated && recentBookings.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          {recentBookings.slice(0, 3).map((booking) => (
            <RecentBooking
              key={booking.id}
              service={booking.service}
              tradie={booking.tradie}
              status={booking.status}
              date={booking.date}
              onPress={() => handleBookingPress(booking.id)}
            />
          ))}
        </View>
      )}

      {/* How It Works */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Choose your service</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Find nearby tradies</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Book and track arrival</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F97316",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  emergencyButton: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  tradiesPreviewContainer: {
    paddingRight: 20,
    gap: 12,
  },
  browseTradiesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF3F2",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F97316",
    gap: 12,
  },
  browseTradiesText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F97316",
  },
  stepsContainer: {
    gap: 16,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: "#F97316",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  stepText: {
    fontSize: 16,
    color: "#1F2937",
    flex: 1,
  },
});
