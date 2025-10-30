import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Briefcase } from "lucide-react-native";
import { TradieJobCard } from "./TradieJobCard";

export function TradieJobsList({
  jobs,
  onJobPress,
  onAcceptJob,
  onDeclineJob,
}) {
  const pendingJobs = jobs.filter((job) => job.status === "pending");
  const acceptedJobs = jobs.filter(
    (job) => job.status === "accepted" || job.status === "in_progress",
  );

  return (
    <View style={styles.jobsListContainer}>
      <Text style={styles.jobListTitle}>Jobs</Text>

      {pendingJobs.length > 0 && (
        <View style={styles.jobSection}>
          <Text style={styles.jobSectionTitle}>
            New Requests ({pendingJobs.length})
          </Text>
          {pendingJobs.map((job) => (
            <TradieJobCard
              key={job.id}
              job={job}
              onPress={onJobPress}
              onAccept={onAcceptJob}
              onDecline={onDeclineJob}
            />
          ))}
        </View>
      )}

      {acceptedJobs.length > 0 && (
        <View style={styles.jobSection}>
          <Text style={styles.jobSectionTitle}>
            My Jobs ({acceptedJobs.length})
          </Text>
          {acceptedJobs.map((job) => (
            <TradieJobCard key={job.id} job={job} onPress={onJobPress} />
          ))}
        </View>
      )}

      {jobs.length === 0 && (
        <View style={styles.emptyState}>
          <Briefcase size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>No jobs yet</Text>
          <Text style={styles.emptyStateText}>
            New job requests will appear here when customers need your services
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  jobsListContainer: {
    flex: 1,
  },
  jobListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  jobSection: {
    marginBottom: 24,
  },
  jobSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
