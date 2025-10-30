import { router } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { create } from "zustand";
import { Modal, View } from "react-native";
import { useAuthModal, useAuthStore, authKey, secureStorage } from "./store";
import { apiFetch, API_ENDPOINTS } from "../api";

/**
 * This hook provides authentication functionality.
 * It may be easier to use the `useAuthModal` or `useRequireAuth` hooks
 * instead as those will also handle showing authentication to the user
 * directly.
 */
export const useAuth = () => {
  const { isReady, auth, setAuth, initializeAuth } = useAuthStore();
  const { isOpen, close, open } = useAuthModal();

  const initiate = useCallback(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Initialize auth on component mount
    if (!isReady) {
      console.log("🔄 useAuth: Initializing authentication...");
      initiate();
    }
  }, [initiate, isReady]);

  const signIn = useCallback(() => {
    open({ mode: "signin" });
  }, [open]);

  const signUp = useCallback(() => {
    open({ mode: "signup" });
  }, [open]);

  const signOut = useCallback(async () => {
    console.log("👋 useAuth: Signing out user...");
    await setAuth(null);
    close();
  }, [setAuth, close]);

  // Add direct credential-based sign in for mobile forms
  const signInWithCredentials = useCallback(
    async ({ email, password, callbackUrl, redirect = true }) => {
      console.log("🚀 MOBILE SIGNIN START");
      console.log("Email:", email);
      console.log("Password provided:", !!password);
      console.log("Callback URL:", callbackUrl);
      console.log("Redirect:", redirect);

      try {
        console.log("📡 Making API request to signin endpoint...");
        console.log("API endpoint:", API_ENDPOINTS.SIGNIN);

        // Use the new API utility instead of raw fetch
        const result = await apiFetch(API_ENDPOINTS.SIGNIN, {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        });

        console.log("📥 API Response received");
        console.log("Raw result:", JSON.stringify(result, null, 2));
        console.log("Result type:", typeof result);
        console.log("Result is null:", result === null);
        console.log("Result is undefined:", result === undefined);

        if (result) {
          console.log("Result keys:", Object.keys(result));
          console.log("Result stringified:", JSON.stringify(result));
        }

        // Validate response structure
        console.log("🔍 Validating response structure...");

        if (!result) {
          console.error("❌ VALIDATION FAILED: No result from API");
          throw new Error("No response from server");
        }

        console.log("Checking for user in result...");
        console.log("result.user exists:", !!result.user);
        console.log("result.user value:", result.user);

        if (!result.user) {
          console.error("❌ VALIDATION FAILED: No user in response");
          console.error("Available keys:", Object.keys(result));
          console.error("Full result object:", JSON.stringify(result, null, 2));
          throw new Error("Invalid response from server: missing user data");
        }

        console.log("Checking for token in result...");
        console.log("result.token exists:", !!result.token);
        console.log(
          "result.token value:",
          typeof result.token,
          result.token?.substring(0, 50) + "...",
        );

        if (!result.token) {
          console.error("❌ VALIDATION FAILED: No token in response");
          console.error("Available keys:", Object.keys(result));
          console.error("Full result object:", JSON.stringify(result, null, 2));
          throw new Error("Invalid response from server: missing token data");
        }

        console.log("✅ Response validation passed");

        // Store the real token from the backend
        const authData = {
          jwt: result.token, // Use real JWT token from backend
          user: result.user,
        };

        console.log("💾 Setting auth state...");
        await setAuth(authData);

        console.log("✅ Auth state updated");
        close(); // Close the auth modal

        // Small delay to ensure state propagation
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (redirect && callbackUrl) {
          console.log("🔄 Redirecting to:", callbackUrl);
          router.replace(callbackUrl);
        }

        console.log("🎉 MOBILE SIGNIN SUCCESS");
        return authData;
      } catch (error) {
        console.error("💥 MOBILE SIGNIN ERROR");
        console.error("Error message:", error.message);
        console.error("Error status:", error.status);
        console.error("Error data:", error.data);
        console.error(
          "Full error:",
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
        );
        throw error;
      }
    },
    [setAuth, close],
  );

  // Add direct credential-based sign up for mobile forms
  const signUpWithCredentials = useCallback(
    async ({
      email,
      password,
      name,
      userType = "customer",
      callbackUrl,
      redirect = true,
    }) => {
      try {
        console.log("Starting signup process for:", { email, userType, name });

        // Use the custom registration endpoints based on user type
        const endpoint =
          userType === "tradie"
            ? API_ENDPOINTS.REGISTER_TRADIE
            : API_ENDPOINTS.REGISTER_CUSTOMER;

        console.log("Using registration endpoint:", endpoint);

        const result = await apiFetch(endpoint, {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            firstName: name?.split(" ")[0] || "",
            lastName: name?.split(" ").slice(1).join(" ") || "",
          }),
        });

        console.log("Registration result:", result);

        if (
          result &&
          result.message &&
          result.message.includes("successfully")
        ) {
          console.log(
            "Registration successful, attempting automatic signin...",
          );

          // Add a small delay to ensure database consistency
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // After successful registration, sign in the user
          return await signInWithCredentials({
            email,
            password,
            callbackUrl,
            redirect,
          });
        } else {
          console.error("Registration failed:", result);
          throw new Error(result?.message || "Registration failed");
        }
      } catch (error) {
        console.error("SignUp error:", error);
        throw error;
      }
    },
    [signInWithCredentials],
  );

  // Add PIN-based authentication methods
  const setupPin = useCallback(
    async ({
      email,
      pin,
      firstName,
      lastName,
      userType = "customer",
      callbackUrl,
      redirect = true,
    }) => {
      try {
        console.log("🔐 Setting up PIN for:", { email, userType, firstName });

        const result = await apiFetch(API_ENDPOINTS.SETUP_PIN, {
          method: "POST",
          body: JSON.stringify({
            email,
            pin,
            firstName,
            lastName,
            userType,
          }),
        });

        console.log("✅ PIN setup result:", result);

        if (result && result.token && result.user) {
          const authData = {
            jwt: result.token,
            user: result.user,
          };

          console.log("💾 Setting auth state after PIN setup...");
          await setAuth(authData);

          console.log("✅ Auth state updated");
          close(); // Close the auth modal

          // Small delay to ensure state propagation
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (redirect && callbackUrl) {
            console.log("🔄 Redirecting to:", callbackUrl);
            router.replace(callbackUrl);
          }

          return authData;
        } else {
          throw new Error(result?.error || "PIN setup failed");
        }
      } catch (error) {
        console.error("💥 PIN setup error:", error);
        throw error;
      }
    },
    [setAuth, close],
  );

  const signInWithPin = useCallback(
    async ({ pin, callbackUrl, redirect = true }) => {
      try {
        console.log("🔐 Signing in with PIN...");

        const result = await apiFetch(API_ENDPOINTS.SIGNIN_PIN, {
          method: "POST",
          body: JSON.stringify({ pin }),
        });

        console.log("✅ PIN signin result:", result);

        if (result && result.token && result.user) {
          const authData = {
            jwt: result.token,
            user: result.user,
          };

          console.log("💾 Setting auth state after PIN signin...");
          await setAuth(authData);

          console.log("✅ Auth state updated");
          close(); // Close the auth modal

          // Small delay to ensure state propagation
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (redirect && callbackUrl) {
            console.log("🔄 Redirecting to:", callbackUrl);
            router.replace(callbackUrl);
          }

          return authData;
        } else {
          throw new Error(result?.error || "PIN signin failed");
        }
      } catch (error) {
        console.error("💥 PIN signin error:", error);
        throw error;
      }
    },
    [setAuth, close],
  );

  return {
    isReady,
    isAuthenticated: isReady ? !!auth : null,
    signIn,
    signOut,
    signUp,
    signInWithCredentials,
    signUpWithCredentials,
    auth,
    setAuth,
    initiate,
    setupPin,
    signInWithPin,
  };
};

/**
 * This hook will automatically open the authentication modal if the user is not authenticated.
 */
export const useRequireAuth = (options) => {
  const { isAuthenticated, isReady } = useAuth();
  const { open } = useAuthModal();

  useEffect(() => {
    if (!isAuthenticated && isReady) {
      open({ mode: options?.mode });
    }
  }, [isAuthenticated, open, options?.mode, isReady]);
};

export default useAuth;
