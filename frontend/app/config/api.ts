// frontend/app/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authentication token if not skipped
  if (!skipAuth) {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      // localStorage might not be available
    }
  }

  try {
    const response = await fetch(endpoint, {
      ...fetchOptions,
      headers,
      credentials: 'include',
    });

    // Try to parse response body
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      // Extract error message from response
      let errorMessage = 'API request failed';
      
      if (typeof responseData === 'object' && responseData !== null) {
        // Handle different error response formats
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else {
          // If it's a validation error with field-specific errors
          errorMessage = JSON.stringify(responseData);
        }
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      }

      console.error('API Error:', {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        errorData: responseData
      });

      throw new Error(errorMessage);
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

export default API_BASE_URL;