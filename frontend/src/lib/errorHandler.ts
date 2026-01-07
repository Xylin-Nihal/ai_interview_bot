/**
 * Error handling utility for API responses
 * Extracts user-friendly error messages from various error formats
 */

interface ValidationError {
  type?: string;
  loc?: string[];
  msg?: string;
  input?: any;
}

interface ErrorResponse {
  detail?: string | ValidationError[];
  error?: string;
  message?: string;
}

/**
 * Extract error message from API response
 * Handles Pydantic validation errors, FastAPI errors, and generic errors
 */
export function getErrorMessage(error: any): string {
  // Check if it's an axios error with response data
  if (error?.response?.data) {
    const data = error.response.data;

    // Handle string detail message
    if (typeof data.detail === "string") {
      return data.detail;
    }

    // Handle Pydantic validation error array
    if (Array.isArray(data.detail)) {
      const messages = data.detail.map((err: ValidationError) => {
        if (err.msg) {
          const field = err.loc?.[1] || "field";
          return `${field}: ${err.msg}`;
        }
        return err.msg || "Validation error";
      });
      return messages.join("; ");
    }

    // Handle generic error object properties
    if (data.error) return String(data.error);
    if (data.message) return String(data.message);

    // Fallback: return stringified data (avoid rendering objects)
    if (typeof data === "string") return data;
  }

  // Handle non-axios errors
  if (error?.message) {
    return String(error.message);
  }

  // Final fallback
  return "An error occurred. Please try again.";
}
