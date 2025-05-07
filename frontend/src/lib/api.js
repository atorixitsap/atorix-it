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
    if (!formData.subject) {
      web3FormData.append('subject', `New Form Submission from ${formData.name || 'Website Visitor'}`);
    }

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
 * Submit form data to the backend API with retry capability for cold starts
 * @param {Object} formData - The form data to submit
 * @param {Number} retries - Number of retry attempts (default: 2)
 * @param {Number} timeout - Timeout in milliseconds (default: 8000)
 * @returns {Promise} - Response from the API
 */
export async function submitFormData(formData, retries = 2, timeout = 8000) {
  // Start with retry count
  let attempts = 0;
  let lastError = null;

  // Create AbortController for the timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  while (attempts <= retries) {
    attempts++;

    try {
      // Clear any previous timeout just in case
      clearTimeout(timeoutId);

      // Set a new timeout for this attempt
      const newTimeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${API_BASE_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      // Clear the timeout since we got a response
      clearTimeout(newTimeoutId);

      // Parse the JSON response
      const data = await response.json();

      // If the response is not ok, throw an error with the message from the API
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred while submitting the form');
      }

      return { success: true, data };
    } catch (error) {
      // Store the last error
      lastError = error;

      // If it's an abort error (timeout) or we've reached max retries, break
      if (error.name === 'AbortError') {
        console.warn(`Request timed out after ${timeout}ms, attempt ${attempts} of ${retries + 1}`);
      } else {
        console.warn(`Error submitting form, attempt ${attempts} of ${retries + 1}:`, error);
      }

      // If we have retries left, wait before trying again (exponential backoff)
      if (attempts <= retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts - 1)));
      } else {
        // No more retries
        break;
      }
    }
  }

  // If we've exhausted all retries, return the error
  console.error('Error submitting form after all retries:', lastError);
  return {
    success: false,
    error: (lastError && lastError.message) || 'An unexpected error occurred'
  };
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

/**
 * Fetch all form submissions from the backend
 * @returns {Promise} - Response from the API with form submissions
 */
export async function fetchFormSubmissions() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/submissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch form submissions');
    }

    return { success: true, data: data.submissions || [] };
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      data: []
    };
  }
}

/**
 * Delete a single form submission
 * @param {string} id - The ID of the submission to delete
 * @returns {Promise} - Response from the API
 */
export async function deleteFormSubmission(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete submission');
    }

    return { success: true, message: 'Submission deleted successfully' };
  } catch (error) {
    console.error('Error deleting form submission:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Delete multiple form submissions
 * @param {Array<string>} ids - The IDs of the submissions to delete
 * @returns {Promise} - Response from the API
 */
export async function deleteBulkFormSubmissions(ids) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/submissions/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete submissions');
    }

    return {
      success: true,
      message: `${ids.length} submissions deleted successfully`
    };
  } catch (error) {
    console.error('Error deleting form submissions:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Export form submissions to Excel format
 * @param {Array} submissions - The submissions to export
 * @returns {Blob} - Excel file as a Blob
 */
export function exportToExcel(submissions) {
  // We'll use client-side approach to create an Excel file
  // This is a simple implementation - in production, consider using a library like XLSX or ExcelJS

  // Create CSV content
  let csvContent = "ID,Name,Email,Phone,Company,Role,Message,Date\n";

  submissions.forEach(sub => {
    // Format date
    const date = sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'N/A';

    // Escape fields to handle commas within fields
    const escapeCsv = (field) => {
      const value = field || '';
      return `"${value.replace(/"/g, '""')}"`;
    };

    // Add row to CSV
    csvContent += [
      escapeCsv(sub._id || sub.id),
      escapeCsv(sub.name),
      escapeCsv(sub.email),
      escapeCsv(sub.phone),
      escapeCsv(sub.company),
      escapeCsv(sub.role),
      escapeCsv(sub.message),
      escapeCsv(date)
    ].join(',') + '\n';
  });

  // Create Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return blob;
}

/**
 * Ping the backend to wake it up from sleep on render.com
 * @returns {Promise<void>}
 */
export async function pingBackend() {
  // Don't need to await the response or handle errors - we just want to send a request
  // to wake up the backend. Use a timeout to not block page rendering.
  if (typeof window !== 'undefined') {
    setTimeout(async () => {
      try {
        const controller = new AbortController();
        // Set a timeout of 5 seconds for the ping
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch(`${API_BASE_URL}/api/ping`, {
          method: 'GET',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
      } catch (error) {
      }
    }, 100);
  }
}
