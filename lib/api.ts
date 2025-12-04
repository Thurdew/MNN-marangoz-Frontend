// API Configuration Constants

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REGISTER: '/api/auth/register',

  // Products
  PRODUCTS: '/api/urunler',
  PRODUCT_BY_ID: (id: string) => `/api/urunler/${id}`,

  // Gallery
  GALLERY: '/api/galeri',
  GALLERY_BY_ID: (id: string) => `/api/galeri/${id}`,

  // Orders
  ORDERS: '/api/siparisler',
  ORDER_BY_ID: (id: string) => `/api/siparisler/${id}`,

  // Quotes
  QUOTES: '/api/ozel-teklif-talebis',
} as const;

// Helper function to build full URL
export function buildUrl(endpoint: string, useStrapi = false): string {
  const baseUrl = useStrapi ? API_CONFIG.STRAPI_URL : API_CONFIG.BASE_URL;
  return `${baseUrl}${endpoint}`;
}

// Fetch with timeout
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = API_CONFIG.TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Fetch with retry logic
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = API_CONFIG.RETRY_ATTEMPTS
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(url, options);

      // If successful or client error (4xx), return immediately
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // If server error (5xx) and not last retry, wait and retry
      if (i < retries - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1))
        );
        continue;
      }

      return response;
    } catch (error) {
      // If it's the last retry, throw the error
      if (i === retries - 1) {
        throw error;
      }

      // Otherwise, wait and retry
      await new Promise(resolve =>
        setTimeout(resolve, API_CONFIG.RETRY_DELAY * (i + 1))
      );
    }
  }

  throw new Error('Max retries reached');
}

// Authenticated fetch helper
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  token?: string | null
): Promise<Response> {
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  if (!authToken) {
    throw new Error('Authentication required');
  }

  return fetchWithRetry(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });
}

// Error handling helper
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
    }
    return error.message;
  }
  return 'Bilinmeyen bir hata oluştu';
}
