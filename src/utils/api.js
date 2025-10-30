/**
 * API utilities for QuickieFix mobile app
 * Handles all API calls with proper error handling and base URL resolution
 */

import { Alert, Platform } from "react-native";

/**
 * Get the base URL for API calls
 */
const getBaseUrl = () => {
  // Log all environment variables for debugging
  console.log("Environment variables check:", {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_BASE_URL: process.env.EXPO_PUBLIC_BASE_URL,
    EXPO_PUBLIC_PROXY_BASE_URL: process.env.EXPO_PUBLIC_PROXY_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  // Priority: Explicit API URL > Base URL > Proxy URL
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const proxyUrl = process.env.EXPO_PUBLIC_PROXY_BASE_URL;

  if (apiUrl) {
    console.log(`Using API URL: ${apiUrl}`);
    return apiUrl;
  }
  if (baseUrl) {
    console.log(`Using Base URL: ${baseUrl}`);
    return baseUrl;
  }
  if (proxyUrl) {
    console.log(`Using Proxy URL: ${proxyUrl}`);
    return proxyUrl;
  }

  // Development fallback for local testing
  if (process.env.NODE_ENV === "development") {
    console.warn("No API URL configured, using localhost fallback");
    // Try different localhost variations for different platforms
    const localhost =
      Platform.OS === "android"
        ? "http://10.0.2.2:3000"
        : "http://localhost:3000";
    console.log(`Using development fallback: ${localhost}`);
    return localhost;
  }

  console.error("No API base URL configured!");
  throw new Error("No API base URL configured. Please set EXPO_PUBLIC_API_URL");
};

/**
 * Enhanced fetch function with error handling and automatic URL resolution
 */
export const apiFetch = async (endpoint, options = {}) => {
  console.log("🌐 API FETCH START");
  console.log("Raw endpoint:", endpoint);
  console.log("Options:", options);

  try {
    const baseUrl = getBaseUrl();
    const url = endpoint.startsWith("/") ? `${baseUrl}${endpoint}` : endpoint;

    console.log(`📡 API Request: ${options.method || "GET"} ${url}`);
    console.log("Final URL:", url);
    console.log("Base URL used:", baseUrl);

    if (options.body && options.method !== "GET") {
      console.log("Request body:", options.body);
      console.log("Request body type:", typeof options.body);
      console.log("Request body length:", options.body.length);
    }

    const requestHeaders = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    console.log("Request headers:", requestHeaders);

    console.log("🚀 Making fetch request...");
    const response = await fetch(url, {
      headers: requestHeaders,
      ...options,
    });

    console.log("📥 Fetch response received");
    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log("Response ok:", response.ok);
    console.log("Response type:", response.type);
    console.log("Response redirected:", response.redirected);
    console.log("Response url:", response.url);

    // Log response headers
    const responseHeaders = Object.fromEntries(response.headers.entries());
    console.log("Response headers:", responseHeaders);

    // Handle different response types
    console.log("🔍 Parsing response...");
    let data;
    const contentType = response.headers.get("content-type");
    console.log("Content-Type:", contentType);

    try {
      if (contentType && contentType.includes("application/json")) {
        console.log("📊 Parsing as JSON...");
        data = await response.json();
        console.log("✅ JSON parsing successful");
        console.log("Parsed data type:", typeof data);
        console.log(
          "Parsed data keys:",
          data && typeof data === "object"
            ? Object.keys(data)
            : "Not an object",
        );
        console.log("Complete parsed data:", data);
      } else {
        console.log("📝 Parsing as text (non-JSON response)...");
        const textResponse = await response.text();
        console.log("Text response:", textResponse);
        console.log("Text response length:", textResponse.length);
        data = { message: textResponse };
        console.log("Wrapped text data:", data);
      }
    } catch (parseError) {
      console.error("💥 Response parsing error:", parseError);
      console.error("Parse error message:", parseError.message);
      console.error("Parse error stack:", parseError.stack);
      data = { message: "Failed to parse server response" };
    }

    console.log("📋 Final parsed data analysis:");
    console.log("- Data exists:", !!data);
    console.log("- Data type:", typeof data);
    console.log(
      "- Data keys:",
      data && typeof data === "object" ? Object.keys(data) : "Not an object",
    );

    if (!response.ok) {
      console.error(`❌ HTTP Error ${response.status}:`, data);
      const error = new Error(
        data.message ||
          data.error ||
          `HTTP ${response.status}: ${response.statusText}`,
      );
      error.status = response.status;
      error.data = data;
      console.error("Throwing HTTP error:", error);
      throw error;
    }

    console.log("✅ API FETCH SUCCESS");
    return data;
  } catch (error) {
    console.error("💥 API FETCH ERROR");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error status:", error.status);
    console.error("Error data:", error.data);
    console.error("Error stack:", error.stack);

    // Enhanced error categorization
    console.log("🔍 Error categorization:");

    // Handle network errors with user-friendly messages
    if (
      error.name === "NetworkError" ||
      error.message.includes("Network request failed") ||
      error.message.includes("fetch") ||
      error.message.includes("Failed to fetch")
    ) {
      console.error("🌐 Categorized as: Network Error");
      Alert.alert(
        "Network Error",
        "Unable to reach QuickieFix servers. Please check your internet connection and try again.",
      );
      throw new Error("Network connection failed");
    }

    // Handle CORS errors
    if (error.message.includes("CORS")) {
      console.error("🔒 Categorized as: CORS Error");
      Alert.alert(
        "Connection Error",
        "There was a problem connecting to QuickieFix. Please try again later.",
      );
      throw new Error("CORS error occurred");
    }

    // Handle timeout errors
    if (error.message.includes("timeout")) {
      console.error("⏱️ Categorized as: Timeout Error");
      Alert.alert(
        "Timeout Error",
        "The request took too long to complete. Please try again.",
      );
      throw new Error("Request timeout");
    }

    // Handle JSON parsing errors specifically
    if (error.name === "SyntaxError" && error.message.includes("JSON")) {
      console.error("📄 Categorized as: JSON Parsing Error");
      console.error(
        "This usually means the server returned HTML instead of JSON",
      );
      throw new Error("Server returned invalid response format");
    }

    console.error("❓ Categorized as: Other/Unknown Error");
    // Re-throw the error for specific handling by calling code
    throw error;
  }
};

/**
 * Authenticated API call - automatically includes auth token
 */
export const authApiFetch = async (
  endpoint,
  options = {},
  authToken = null,
) => {
  const headers = { ...options.headers };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return apiFetch(endpoint, {
    ...options,
    headers,
  });
};

/**
 * Common API endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNIN: "/api/auth/signin",
  REGISTER_CUSTOMER: "/api/auth/register/customer",
  REGISTER_TRADIE: "/api/auth/register/tradie",
  REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
  RESET_PASSWORD: "/api/auth/reset-password",
  SETUP_PIN: "/api/auth/setup-pin",
  SIGNIN_PIN: "/api/auth/signin-pin",

  // User endpoints
  USER_PROFILE: "/api/user/profile",

  // Service endpoints
  SERVICE_CATEGORIES: "/api/service-categories",
  SERVICE_REQUESTS: "/api/service-requests",
  TRADIE_SEARCH: "/api/tradies/search",
  TRADIE_JOBS: "/api/tradies/jobs",

  // Other endpoints
  REVIEWS: "/api/reviews",
  SAVE_PUSH_TOKEN: "/api/save-push-token",
};

export { getBaseUrl };
