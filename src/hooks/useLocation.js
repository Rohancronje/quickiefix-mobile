import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need location access to find tradies near you.",
          );
          setError("Location permission denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setError(null);
      } catch (error) {
        console.error("Error getting location:", error);
        setError("Failed to get location");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, loading, error };
}
