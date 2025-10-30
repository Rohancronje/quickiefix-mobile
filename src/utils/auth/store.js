import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fix for missing EXPO_PUBLIC_PROJECT_GROUP_ID
const projectId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID || "quickiefix";
export const authKey = `${projectId}-jwt`;

// SecureStore wrapper with AsyncStorage fallback for development/emulators
export const secureStorage = {
  async getItemAsync(key) {
    try {
      const result = await SecureStore.getItemAsync(key);
      console.log(
        `📖 SecureStore.getItemAsync(${key}):`,
        !!result,
        result?.length || 0,
        "chars",
      );
      return result;
    } catch (error) {
      console.warn("SecureStore failed, falling back to AsyncStorage:", error);
      // Fallback to AsyncStorage in development/emulator
      if (process.env.NODE_ENV === "development") {
        const result = await AsyncStorage.getItem(key);
        console.log(
          `📖 AsyncStorage.getItem(${key}):`,
          !!result,
          result?.length || 0,
          "chars",
        );
        return result;
      }
      throw error;
    }
  },

  async setItemAsync(key, value) {
    try {
      console.log(
        `💾 SecureStore.setItemAsync(${key}):`,
        value?.length || 0,
        "chars",
      );
      await SecureStore.setItemAsync(key, value);
      console.log(`✅ SecureStore.setItemAsync(${key}): Success`);

      // Verify the data was actually stored
      const verification = await SecureStore.getItemAsync(key);
      console.log(
        `🔍 Verification read:`,
        !!verification,
        verification?.length || 0,
        "chars",
      );
      if (!verification) {
        console.error(
          `❌ Data was not actually stored to SecureStore for key: ${key}`,
        );
        throw new Error("Data was not properly stored to SecureStore");
      }
    } catch (error) {
      console.warn("SecureStore failed, falling back to AsyncStorage:", error);
      // Fallback to AsyncStorage in development/emulator
      if (process.env.NODE_ENV === "development") {
        console.log(
          `💾 AsyncStorage.setItem(${key}):`,
          value?.length || 0,
          "chars",
        );
        await AsyncStorage.setItem(key, value);
        console.log(`✅ AsyncStorage.setItem(${key}): Success`);

        // Verify the data was actually stored
        const verification = await AsyncStorage.getItem(key);
        console.log(
          `🔍 AsyncStorage verification read:`,
          !!verification,
          verification?.length || 0,
          "chars",
        );
      } else {
        throw error;
      }
    }
  },

  async deleteItemAsync(key) {
    try {
      console.log(`🗑️ SecureStore.deleteItemAsync(${key})`);
      await SecureStore.deleteItemAsync(key);
      console.log(`✅ SecureStore.deleteItemAsync(${key}): Success`);
    } catch (error) {
      console.warn("SecureStore failed, falling back to AsyncStorage:", error);
      // Fallback to AsyncStorage in development/emulator
      if (process.env.NODE_ENV === "development") {
        console.log(`🗑️ AsyncStorage.removeItem(${key})`);
        await AsyncStorage.removeItem(key);
        console.log(`✅ AsyncStorage.removeItem(${key}): Success`);
      } else {
        throw error;
      }
    }
  },
};

/**
 * This store manages the authentication state of the application.
 */
export const useAuthStore = create((set, get) => ({
  isReady: false,
  auth: null,
  setAuth: async (auth) => {
    console.log(
      "🏪 AUTH STORE: setAuth called with:",
      !!auth ? "AUTH DATA" : "NULL",
    );
    if (auth) {
      console.log("🏪 AUTH STORE: Auth data details:", {
        hasUser: !!auth.user,
        hasJwt: !!auth.jwt,
        userEmail: auth.user?.email,
        jwtLength: auth.jwt?.length || 0,
      });
    }

    try {
      if (auth) {
        console.log("💾 AUTH STORE: Storing auth data to secure storage...");
        const authString = JSON.stringify(auth);
        console.log(
          "📦 AUTH STORE: Serialized auth data length:",
          authString.length,
        );

        await secureStorage.setItemAsync(authKey, authString);
        console.log("✅ AUTH STORE: Auth data stored successfully");

        // Double-check by reading it back immediately
        const verification = await secureStorage.getItemAsync(authKey);
        if (!verification) {
          console.error(
            "❌ AUTH STORE: CRITICAL - Auth data was not actually stored!",
          );
          throw new Error("Auth data storage verification failed");
        }
        console.log("🔍 AUTH STORE: Storage verification successful");
      } else {
        console.log("🗑️ AUTH STORE: Deleting auth data from secure storage...");
        await secureStorage.deleteItemAsync(authKey);
        console.log("✅ AUTH STORE: Auth data deleted successfully");
      }

      // Update state immediately and synchronously
      console.log("📱 AUTH STORE: Updating Zustand state...");
      set({ auth });

      // Verify state was updated
      const currentState = get();
      const stateUpdated = !!currentState.auth === !!auth;
      console.log("🔍 AUTH STORE: State update verification:", {
        intended: !!auth,
        actual: !!currentState.auth,
        success: stateUpdated,
      });

      if (!stateUpdated) {
        console.error(
          "❌ AUTH STORE: CRITICAL - State was not properly updated!",
        );
        throw new Error("State update verification failed");
      }

      console.log("✅ AUTH STORE: setAuth completed successfully");
    } catch (error) {
      console.error("💥 AUTH STORE: Error in setAuth:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Still update the state even if storage fails to maintain consistency
      console.log("⚠️ AUTH STORE: Updating state despite storage error...");
      set({ auth });

      // Re-throw the error so calling code knows about the failure
      throw error;
    }
  },
  initializeAuth: async () => {
    console.log("🔄 AUTH STORE: initializeAuth called");
    console.log("🔑 AUTH STORE: Using auth key:", authKey);

    try {
      console.log("📖 AUTH STORE: Reading auth data from storage...");
      const storedAuth = await secureStorage.getItemAsync(authKey);
      console.log("📋 AUTH STORE: Raw stored data exists:", !!storedAuth);

      if (storedAuth) {
        console.log(
          "📦 AUTH STORE: Raw stored data length:",
          storedAuth.length,
        );
        console.log(
          "📝 AUTH STORE: First 100 chars:",
          storedAuth.substring(0, 100),
        );
      }

      let parsedAuth = null;
      if (storedAuth) {
        try {
          console.log("🔍 AUTH STORE: Parsing stored auth data...");
          parsedAuth = JSON.parse(storedAuth);
          console.log("✅ AUTH STORE: Auth data parsed successfully");
          console.log("👤 AUTH STORE: Parsed auth details:", {
            hasUser: !!parsedAuth?.user,
            hasJwt: !!parsedAuth?.jwt,
            userEmail: parsedAuth?.user?.email,
            jwtLength: parsedAuth?.jwt?.length || 0,
          });
        } catch (parseError) {
          console.error("💥 AUTH STORE: JSON parsing failed:", parseError);
          console.error("🗑️ AUTH STORE: Clearing corrupted auth data...");
          await secureStorage.deleteItemAsync(authKey);
          parsedAuth = null;
        }
      }

      console.log("📱 AUTH STORE: Setting initialized state...");
      set({
        auth: parsedAuth,
        isReady: true,
      });

      // Verify the state was set correctly
      const finalState = get();
      console.log("🔍 AUTH STORE: Final state verification:", {
        isReady: finalState.isReady,
        hasAuth: !!finalState.auth,
        userEmail: finalState.auth?.user?.email,
      });

      console.log("✅ AUTH STORE: initializeAuth completed successfully");
      return parsedAuth;
    } catch (error) {
      console.error("💥 AUTH STORE: Error in initializeAuth:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Set ready state even on error to prevent app from hanging
      console.log("⚠️ AUTH STORE: Setting ready state despite error...");
      set({
        auth: null,
        isReady: true,
      });

      return null;
    }
  },
}));

/**
 * This store manages the state of the authentication modal.
 */
export const useAuthModal = create((set) => ({
  isOpen: false,
  mode: "signup",
  open: (options) => set({ isOpen: true, mode: options?.mode || "signup" }),
  close: () => set({ isOpen: false }),
}));
