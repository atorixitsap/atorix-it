/**
 * API utilities for interacting with the backend
 */

// Base URL for API requests - will be provided via environment variables
// Updated to use the deployed backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://atorix-it.onrender.com';

/**
 * Submit form data to the backend API
 * @param {Object} formData - The form data to submit
 * @returns {Promise} - Response from the API
 */
export async function submitFormData(formData) {
  try {
    console.log('Submitting form data to:', `${API_BASE_URL}/api/submit`);
    console.log('Form data:', formData);

    const response = await fetch(`${API_BASE_URL}/api/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Parse the JSON response
    const data = await response.json();
    console.log('API response:', data);

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
 * @param {Object} formData - Raw form data from components
 * @returns {Object} - Normalized form data
 */
export function normalizeFormData(formData) {
  // Start with the basic fields required by the backend
  const normalizedData = {
    name: '',
    email: '',
    contact: '',
    countryCode: '', // Optional
    coursename: '', // Optional
    location: '', // Optional
  };

  // Map form fields based on the type of form
  // Handle first name + last name combination
  if (formData.firstName && formData.lastName) {
    normalizedData.name = `${formData.firstName} ${formData.lastName}`.trim();
  }
  // Handle single name field
  else if (formData.name) {
    normalizedData.name = formData.name.trim();
  }

  // Map email, always keeping the same field name
  normalizedData.email = formData.email ? formData.email.trim() : '';

  // Map contact (phone)
  normalizedData.contact = formData.phone || formData.contact || '';

  // Add company as location if available
  if (formData.company) {
    normalizedData.location = formData.company.trim();
  }

  // Add role or interests as coursename if available
  if (formData.role) {
    normalizedData.coursename = formData.role;
  } else if (formData.interests && Array.isArray(formData.interests) && formData.interests.length) {
    normalizedData.coursename = formData.interests.join(', ');
  }

  // Add message to coursename if available, appending to existing coursename
  if (formData.message) {
    normalizedData.coursename = normalizedData.coursename
      ? `${normalizedData.coursename} - ${formData.message.substring(0, 100)}`
      : formData.message.substring(0, 100);
  }

  return normalizedData;
}
