/**
 * API utilities for interacting with the backend
 */

// Base URL for API requests - will be provided via environment variables
// Updated to use the deployed backend URL or localhost for development
// Detect if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
                     (isDevelopment ? 'http://localhost:5001' : 'https://atorix-it.onrender.com');

// Web3Forms API endpoint
const WEB3FORMS_API_URL = 'https://api.web3forms.com/submit';
// Your Web3Forms access key - should be stored in env variables for production
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE';

/**
 * Submit form data to Web3Forms to receive emails
 * @param {Object} formData - The form data to submit
 * @returns {Promise} - Response from the Web3Forms API
 */
export async function submitWeb3FormData(formData) {
  try {
    // Create a new FormData instance
    const web3FormData = new FormData();

    // Add the access key
    web3FormData.append('access_key', WEB3FORMS_ACCESS_KEY);

    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      web3FormData.append(key, value);
    });

    // Optionally set subject
    web3FormData.append('subject', `New Contact Form Submission from ${formData.name || 'Website Visitor'}`);

    // You can add a hidden honeypot field to prevent spam
    web3FormData.append('botcheck', '');

    const response = await fetch(WEB3FORMS_API_URL, {
      method: 'POST',
      body: web3FormData
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, data };
    } else {
      throw new Error(data.message || 'Form submission failed');
    }
  } catch (error) {
    console.error('Error submitting form to Web3Forms:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Submit form data to the backend API
 * @param {Object} formData - The form data to submit
 * @returns {Promise} - Response from the API
 */
export async function submitFormData(formData) {
  try {

    const response = await fetch(`${API_BASE_URL}/api/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Parse the JSON response
    const data = await response.json();

    // If the response is not ok, throw an error with the message from the API
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred while submitting the form');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Normalize form data to match the backend API's expected structure
 *
 * Backend Schema:
 * - name: String (required)
 * - email: String (required)
 * - phone: String (required) - Phone number
 * - company: String (optional)
 * - role: String (optional)
 * - interestedIn: Array of String (optional)
 * - message: String (optional)
 *
 * @param {Object} formData - Raw form data from components
 * @returns {Object} - Normalized form data
 */
export function normalizeFormData(formData) {
  // Create the normalized structure to match backend schema
  const normalizedData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    interestedIn: [],
    message: '',
  };

  // Process name field
  if (formData.firstName && formData.lastName) {
    // If we have first name and last name separate, combine them
    normalizedData.name = `${formData.firstName} ${formData.lastName}`.trim();
  } else if (formData.name) {
    // Otherwise use the name field directly
    normalizedData.name = formData.name.trim();
  }

  // Email field (same name in both frontend and backend)
  normalizedData.email = formData.email ? formData.email.trim() : '';

  // Map phone field (frontend might use 'phone' or legacy 'contact')
  normalizedData.phone = formData.phone ? formData.phone.trim() :
                        (formData.contact ? formData.contact.trim() : '');

  // Company field (same name in backend)
  normalizedData.company = formData.company ? formData.company.trim() : '';

  // Role field (same name in backend)
  normalizedData.role = formData.role ? formData.role.trim() : '';

  // Interested in fields (from checkbox group in demo form)
  if (formData.interests && Array.isArray(formData.interests)) {
    normalizedData.interestedIn = formData.interests.map(interest => interest.trim());
  }

  // Message field (same name in backend)
  normalizedData.message = formData.message ? formData.message.trim() : '';

  return normalizedData;
}
