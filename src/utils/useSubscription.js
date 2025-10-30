import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import { create } from "zustand";

const useSubscriptionStore = create((set, get) => ({
  status: null,
  loading: true,
  setStatus: (status) => set({ status }),
  setLoading: (loading) => set({ loading }),
  checkSubscription: async () => {
    if (get().loading === false) {
      return;
    }

    try {
      const response = await fetch("/api/get-subscription-status", {
        method: "POST",
      });
      const data = await response.json();

      const isActive = data.status === "active";

      set({ status: isActive, loading: false });
    } catch (error) {
      console.error("Error checking subscription:", error);
      set({ loading: false });
    }
  },
  refetchSubscription: async () => {
    set({ loading: true });

    try {
      const response = await fetch("/api/get-subscription-status", {
        method: "POST",
      });
      const data = await response.json();

      const isActive = data.status === "active";

      set({ status: isActive, loading: false });
    } catch (error) {
      console.error("Error refetching subscription:", error);
      set({ loading: false });
    }
  },
}));

export function useSubscription() {
  const { status, loading, checkSubscription, refetchSubscription } =
    useSubscriptionStore();
  const router = useRouter();

  const initiateSubscription = React.useCallback(async () => {
    try {
      const response = await fetch("/api/stripe-checkout-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          redirectURL:
            process.env.EXPO_PUBLIC_APP_URL || "exp://localhost:8081",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get checkout link");
      }

      const { url } = await response.json();
      if (url) {
        router.push({
          pathname: "/stripe",
          params: { checkoutUrl: url },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        "Could not start the upgrade process. Please try again.",
        [{ text: "OK" }],
      );
    }
  }, [router]);

  React.useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    isSubscribed: status,
    data: status,
    loading,
    initiateSubscription,
    refetchSubscription,
  };
}

export default useSubscription;
