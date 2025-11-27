// frontend/app/config/api.ts
import { API_BASE_URL } from './env';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  // Detect if body is FormData
  const isFormData = fetchOptions.body instanceof FormData;

  const headers: HeadersInit = {
    ...fetchOptions.headers,
    // Only set Content-Type for JSON, not for FormData
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
    let responseData: any;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      let errorMessage = 'API request failed';

      if (typeof responseData === 'object' && responseData !== null) {
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else {
          errorMessage = JSON.stringify(responseData);
        }
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      }

      console.error('API Error:', {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        errorData: responseData,
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
