/**
 * Centralized route definitions for QuickieFix mobile app
 * This prevents hardcoded route strings throughout the app
 */

export const ROUTES = {
  // Authentication routes
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  SIGNUP_CUSTOMER: "/signup/customer",
  SIGNUP_TRADIE: "/signup/tradie",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Main app routes
  HOME: "/(tabs)/home",
  JOBS: "/(tabs)/jobs",
  MESSAGES: "/(tabs)/messages",
  REQUEST_JOB: "/(tabs)/request-job",

  // Profile and settings
  PROFILE: "/profile",
  SETTINGS: "/settings",

  // Service related
  SEARCH: "/search",
  SERVICE_MAP: "/service-map",
  JOB_DETAIL: (id) => `/(tabs)/job-detail/${id}`,

  // Payment and subscription
  STRIPE: "/stripe",
};

/**
 * Helper function to navigate to a route
 */
export const navigateTo = (router, route, options = {}) => {
  if (options.replace) {
    router.replace(route);
  } else {
    router.push(route);
  }
};

/**
 * Helper function for authenticated navigation
 * Redirects to signin if not authenticated
 */
export const navigateAuthenticated = (
  router,
  route,
  isAuthenticated,
  options = {},
) => {
  if (isAuthenticated) {
    navigateTo(router, route, options);
  } else {
    navigateTo(router, ROUTES.SIGNIN, { replace: true });
  }
};
