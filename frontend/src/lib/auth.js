/**
 * Authentication utilities for dashboard access
 */

// Get dashboard credentials from environment variables
const DASHBOARD_USERNAME = process.env.NEXT_PUBLIC_DASHBOARD_USERNAME || 'admin@atorix.com';
const DASHBOARD_PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || 'securePassword1234!';

/**
 * Check if credentials are valid
 * @param {string} username - The username/email to check
 * @param {string} password - The password to check
 * @returns {boolean} - Whether the credentials are valid
 */
export function validateCredentials(username, password) {
  return username === DASHBOARD_USERNAME && password === DASHBOARD_PASSWORD;
}

/**
 * Store authentication token in sessionStorage
 * This is a simple implementation. In a real app, you'd use a proper JWT token
 */
export function setAuthToken() {
  if (typeof window !== 'undefined') {
    // Create a simple token (timestamp + username hash)
    const token = `atorix_dashboard_${Date.now()}_${btoa(DASHBOARD_USERNAME)}`;
    sessionStorage.setItem('atorix_auth_token', token);
    return token;
  }
  return null;
}

/**
 * Remove authentication token from sessionStorage
 */
export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('atorix_auth_token');
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export function isAuthenticated() {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('atorix_auth_token');
    return !!token;
  }
  return false;
}

/**
 * Login user
 * @param {string} username - The username/email
 * @param {string} password - The password
 * @returns {object} - Result object with success and message
 */
export function login(username, password) {
  if (validateCredentials(username, password)) {
    const token = setAuthToken();
    return {
      success: true,
      token
    };
  }

  return {
    success: false,
    message: 'Invalid username or password'
  };
}

/**
 * Logout user
 */
export function logout() {
  clearAuthToken();
}
