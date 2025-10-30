/**
 * Validation utilities for QuickieFix mobile app
 */

/**
 * Validates an email address
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: "Email address is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true, error: null };
};

/**
 * Validates password strength and requirements
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validates password confirmation
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true, error: null };
};

/**
 * Validates a name (first name, last name, or full name)
 */
export const validateName = (name, fieldName = "Name") => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters long`,
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validates phone number
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, "");

  // Check for valid phone number length (8-15 digits)
  if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }

  return { isValid: true, error: null };
};

/**
 * Validates business name
 */
export const validateBusinessName = (businessName) => {
  if (!businessName || businessName.trim().length === 0) {
    return { isValid: false, error: "Business name is required" };
  }

  if (businessName.trim().length < 2) {
    return {
      isValid: false,
      error: "Business name must be at least 2 characters long",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validates ABN (Australian Business Number)
 */
export const validateABN = (abn) => {
  if (!abn) {
    return { isValid: false, error: "ABN is required" };
  }

  // Remove spaces and hyphens
  const cleanABN = abn.replace(/[\s-]/g, "");

  // Check if it's 11 digits
  if (!/^\d{11}$/.test(cleanABN)) {
    return { isValid: false, error: "ABN must be 11 digits" };
  }

  // Basic ABN validation algorithm
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = cleanABN.split("").map(Number);

  // Subtract 1 from the first digit
  digits[0] = digits[0] - 1;

  // Calculate weighted sum
  const sum = digits.reduce(
    (acc, digit, index) => acc + digit * weights[index],
    0,
  );

  // Check if sum is divisible by 89
  if (sum % 89 !== 0) {
    return { isValid: false, error: "Please enter a valid ABN" };
  }

  return { isValid: true, error: null };
};

/**
 * Validates hourly rate
 */
export const validateHourlyRate = (rate) => {
  if (!rate) {
    return { isValid: false, error: "Hourly rate is required" };
  }

  const numericRate = parseFloat(rate);

  if (isNaN(numericRate)) {
    return { isValid: false, error: "Please enter a valid hourly rate" };
  }

  if (numericRate <= 0) {
    return { isValid: false, error: "Hourly rate must be greater than $0" };
  }

  if (numericRate > 1000) {
    return {
      isValid: false,
      error: "Hourly rate seems too high. Please enter a reasonable rate",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Generic required field validator
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim().length === 0)) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true, error: null };
};
