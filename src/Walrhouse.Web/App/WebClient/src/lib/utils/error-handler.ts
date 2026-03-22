import { AxiosError } from 'axios';

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>; // For 400 Validation errors
}

// Map of detail strings (e.g., "LockedOut") to user-friendly messages.
export type ErrorMappings = Record<string, string>;

/**
 * Parses an AxiosError and returns a user-friendly error message.
 *
 * @param error - The Axios error object.
 * @param customMappings - Optional record to map specific server-side 'detail' strings (like "LockedOut") to custom messages.
 */
export const getErrorMessage = (error: AxiosError, customMappings?: ErrorMappings): string => {
  const data = error.response?.data as ProblemDetails;
  const status = error.response?.status;

  if (!data) return 'An unexpected error occurred. Please try again.';

  // 1. Handle Identification results using the passed customMappings
  if (status === 401 || status === 403) {
    if (data.detail && customMappings && customMappings[data.detail]) {
      return customMappings[data.detail];
    }
    // Fallback if no custom mapping found—either the server's detail or generic text
    return data.detail || 'Authentication failed.';
  }

  // 2. Handle 400 Validation Errors
  if (status === 400 && data.errors) {
    // Flatten validation errors into a single string
    return Object.values(data.errors).flat().join(' ');
  }

  // 3. Fallback to common HTTP Status Codes
  switch (status) {
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return "A server error occurred. We're working on it.";
    default:
      return data.title || 'Something went wrong.';
  }
};
