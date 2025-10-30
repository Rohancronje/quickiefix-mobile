import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TradieJobsList } from "./TradieJobsList";
import { TradieStats } from "./TradieStats";
import { TradieQuickActions } from "./TradieQuickActions";

export function TradieDashboard({ user, insets, onJobPress }) {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch tradie jobs and stats on mount
  useEffect(() => {
    if (!user) return;
    fetchJobs();
    fetchStats();
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/tradies/jobs?tradieUserId=${user.user_id || user.id}`,
      );
      if (response.ok) {
        const jobsData = await response.json();
        setJobs(jobsData);
      } else {
        console.error("Failed to fetch jobs");
        // Fall back to mock data for demo
        setJobs([
          {
            id: 1,
            title: "Fix Kitchen Sink",
            description:
              "Kitchen sink is blocked and not draining properly. Need urgent plumbing help.",
            location_address: "123 Main St, Auckland",
            estimated_cost: 150,
            status: "pending",
            created_at: "2024-01-15T12:00:00Z",
            urgency: "high",
            customer_name: "Sarah Johnson",
          },
          {
            id: 2,
            title: "Bathroom Light Installation",
            description:
              "Need to install new LED lights in bathroom. Existing wiring is ready.",
            location_address: "456 Queen St, Wellington",
            estimated_cost: 200,
            status: "accepted",
            created_at: "2024-01-14T10:30:00Z",
            urgency: "normal",
            customer_name: "Mike Smith",
          },
          {
            id: 3,
            title: "Garden Fence Repair",
            description:
              "Storm damaged garden fence needs repair. About 10 meters of fencing.",
            location_address: "789 Park Ave, Christchurch",
            estimated_cost: 300,
            status: "in_progress",
            created_at: "2024-01-13T15:45:00Z",
            urgency: "low",
            customer_name: "Emma Wilson",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Fall back to mock data for demo
      setJobs([
        {
          id: 1,
          title: "Fix Kitchen Sink",
          description:
            "Kitchen sink is blocked and not draining properly. Need urgent plumbing help.",
          location_address: "123 Main St, Auckland",
          estimated_cost: 150,
          status: "pending",
          created_at: "2024-01-15T12:00:00Z",
          urgency: "high",
          customer_name: "Sarah Johnson",
        },
        {
          id: 2,
          title: "Bathroom Light Installation",
          description:
            "Need to install new LED lights in bathroom. Existing wiring is ready.",
          location_address: "456 Queen St, Wellington",
          estimated_cost: 200,
          status: "accepted",
          created_at: "2024-01-14T10:30:00Z",
          urgency: "normal",
          customer_name: "Mike Smith",
        },
        {
          id: 3,
          title: "Garden Fence Repair",
          description:
            "Storm damaged garden fence needs repair. About 10 meters of fencing.",
          location_address: "789 Park Ave, Christchurch",
          estimated_cost: 300,
          status: "in_progress",
          created_at: "2024-01-13T15:45:00Z",
          urgency: "low",
          customer_name: "Emma Wilson",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = () => {
    // Calculate stats from jobs
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(
      (job) => job.status === "accepted" || job.status === "in_progress",
    ).length;
    const completedJobs = jobs.filter((job) => job.status === "completed");
    const totalEarnings = completedJobs.reduce(
      (sum, job) => sum + (parseFloat(job.estimated_cost) || 0),
      0,
    );

    setStats({
      totalJobs,
      activeJobs,
      totalEarnings: totalEarnings.toFixed(0),
      rating: user?.rating || "4.8",
    });
  };

  // Update stats whenever jobs change
  useEffect(() => {
    fetchStats();
  }, [jobs]);

  const handleAcceptJob = async (jobId) => {
    try {
      const response = await fetch("/api/tradies/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          action: "accept",
          tradieUserId: user.user_id || user.id,
        }),
      });

      if (response.ok) {
        // Update job status locally for immediate feedback
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, status: "accepted" } : job,
          ),
        );
        // Also refresh from server
        await fetchJobs();
      } else {
        console.error("Failed to accept job");
      }
    } catch (error) {
      console.error("Error accepting job:", error);
      // Mock accept for demo
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: "accepted" } : job,
        ),
      );
    }
  };

  const handleDeclineJob = async (jobId) => {
    try {
      const response = await fetch("/api/tradies/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          action: "decline",
          tradieUserId: user.user_id || user.id,
        }),
      });

      if (response.ok) {
        // Remove from list locally
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      } else {
        console.error("Failed to decline job");
      }
    } catch (error) {
      console.error("Error declining job:", error);
      // Mock decline for demo
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    }
  };

  const handleToggleAvailability = async () => {
    // In a real app, this would update the tradie's availability status
    setIsAvailable((prev) => !prev);
    // You could also call an API to update availability in the database
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Stats */}
      <TradieStats stats={stats} />

      {/* Quick Actions */}
      <TradieQuickActions
        onToggleAvailability={handleToggleAvailability}
        isAvailable={isAvailable}
      />

      {/* Job List */}
      <TradieJobsList
        jobs={jobs}
        onJobPress={onJobPress}
        onAcceptJob={handleAcceptJob}
        onDeclineJob={handleDeclineJob}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
