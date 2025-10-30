import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MapPin } from "lucide-react-native";

const getJobStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#F59E0B";
    case "accepted":
      return "#3B82F6";
    case "in_progress":
      return "#8B5CF6";
    case "completed":
      return "#10B981";
    case "cancelled":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export function TradieJobCard({ job, onPress, onAccept, onDecline }) {
  return (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => onPress(job.id)}
      activeOpacity={0.8}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View
          style={[
            styles.jobStatusBadge,
            { backgroundColor: getJobStatusColor(job.status) },
          ]}
        >
          <Text style={styles.jobStatusText}>{job.status}</Text>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.jobDetailItem}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.jobDetailText}>{job.location_address}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Text style={styles.jobPrice}>${job.estimated_cost || "TBD"}</Text>
        </View>
      </View>

      <View style={styles.jobMeta}>
        <Text style={styles.jobDate}>
          {new Date(job.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.jobUrgency}>{job.urgency} priority</Text>
      </View>

      {job.status === "pending" && (
        <View style={styles.jobActions}>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => onDecline(job.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => onAccept(job.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginRight: 12,
  },
  jobStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  jobDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  jobDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  jobDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  jobDetailText: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
  jobPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F97316",
  },
  jobMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  jobDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  jobUrgency: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  jobActions: {
    flexDirection: "row",
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#F97316",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
