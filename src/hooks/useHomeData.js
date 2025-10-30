import { useState, useEffect } from "react";

export function useHomeData(user, location) {
  const [recentBookings, setRecentBookings] = useState([]);
  const [featuredTradies, setFeaturedTradies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecentBookings = async () => {
    try {
      const response = await fetch("/api/service-requests/recent");
      if (response.ok) {
        const bookings = await response.json();
        setRecentBookings(bookings);
      }
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
    }
  };

  const fetchFeaturedTradies = async () => {
    try {
      const queryParams = new URLSearchParams({
        lat: location.coords.latitude.toString(),
        lng: location.coords.longitude.toString(),
        limit: "3",
      });

      const response = await fetch(`/api/tradies/search?${queryParams}`);
      if (response.ok) {
        const tradies = await response.json();
        setFeaturedTradies(tradies);
      }
    } catch (error) {
      console.error("Error fetching featured tradies:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecentBookings();
    }
  }, [user]);

  useEffect(() => {
    if (location) {
      fetchFeaturedTradies();
    }
  }, [location]);

  return {
    recentBookings,
    featuredTradies,
    loading,
    refetchBookings: fetchRecentBookings,
    refetchTradies: fetchFeaturedTradies,
  };
}
