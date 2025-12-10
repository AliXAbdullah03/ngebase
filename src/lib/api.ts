/**
 * API Configuration
 * 
 * This file handles API base URL configuration for external backend.
 * Set NEXT_PUBLIC_API_URL in your .env.local file
 * 
 * Example: NEXT_PUBLIC_API_URL=http://localhost:5000/api
 */

export const getApiUrl = (): string => {
  // Check for environment variable first
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return apiUrl;
    }
  } else {
    // Server-side: use environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    if (apiUrl) {
      return apiUrl;
    }
  }

  // Default fallback (for development)
  // Change this to your backend URL if not using env variable
  return 'http://localhost:5000/api';
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if available (from localStorage, cookies, etc.)
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    : null;

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized errors - check for invalid/expired token
  if (response.status === 401 && typeof window !== 'undefined') {
    try {
      // Clone the response so we can read it without consuming the body
      const clonedResponse = response.clone();
      const errorData = await clonedResponse.json().catch(() => null);
      
      // Check if it's an AUTH_INVALID error
      if (errorData?.error?.code === 'AUTH_INVALID' || 
          errorData?.error?.message?.includes('Invalid or expired token') ||
          errorData?.error?.message?.includes('expired')) {
        
        // Clear authentication tokens
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        
        // Redirect to login page
        window.location.href = '/login';
        
        // Return the response anyway (though redirect will happen)
        return response;
      }
    } catch (err) {
      // If we can't parse the error, still treat 401 as auth failure
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }

  return response;
};


