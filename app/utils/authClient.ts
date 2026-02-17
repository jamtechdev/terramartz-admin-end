// Utility for handling authentication tokens in client components
'use client';

export async function getAuthTokenClient(): Promise<string | null> {
  try {
    // For client-side, we need to get the token from localStorage or cookies
    // Since we can't access server-side cookies directly, we'll check localStorage first
    if (typeof window !== 'undefined') {
      // Try both possible localStorage keys for backward compatibility
      let token = localStorage.getItem('authToken');
      console.log('authToken from localStorage:', !!token); // Debug log

      if (!token) {
        token = localStorage.getItem('token');
        console.log('token from localStorage:', !!token); // Debug log
      }

      if (token) {
        console.log('Returning token from localStorage'); // Debug log
        return token;
      }
    }

    // If localStorage doesn't have it, try to get from cookie
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      console.log('Cookies found:', cookies.length); // Debug log

      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      console.log('Token cookie found:', !!tokenCookie); // Debug log

      if (tokenCookie) {
        const tokenValue = tokenCookie.split('=')[1];
        console.log('Returning token from cookie'); // Debug log
        return tokenValue;
      }
    }

    console.log('No token found in localStorage or cookies'); // Debug log
    return null;
  } catch (err) {
    console.error('Failed to get auth token:', err);
    return null;
  }
}

// Helper to set auth token
export function setAuthTokenClient(token: string): void {
  try {
    if (typeof window !== 'undefined') {
      // Set both possible keys for backward compatibility
      localStorage.setItem('authToken', token);
      localStorage.setItem('token', token);
    }
  } catch (err) {
    console.error('Failed to set auth token:', err);
  }
}

// Helper to remove auth token
export function removeAuthTokenClient(): void {
  try {
    if (typeof window !== 'undefined') {
      // Remove both possible keys for backward compatibility
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
    }
    if (typeof document !== 'undefined') {
      // Clear cookie as well
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
  } catch (err) {
    console.error('Failed to remove auth token:', err);
  }
}

// Helper to parse JWT token
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}

// Helper to get user role from token
export async function getUserRoleFromToken(): Promise<string | null> {
  const token = await getAuthTokenClient();
  if (!token) return null;

  const decoded = parseJwt(token);
  return decoded ? decoded.role : null;
}

// Helper to check if token is valid and not expired
export function isTokenValid(token: string): boolean {
  try {
    const decoded = parseJwt(token);
    if (!decoded) return false;

    // Check if token has expiration
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.log('Token has expired');
        return false;
      }
    }

    // Check if token has required fields
    if (!decoded.id) {
      console.log('Token missing user ID');
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error validating token:', e);
    return false;
  }
}

// Helper to validate token and clean up if invalid
export async function validateAndGetToken(): Promise<string | null> {
  const token = await getAuthTokenClient();

  if (!token) {
    console.log('No token found');
    return null;
  }

  if (!isTokenValid(token)) {
    console.log('Token is invalid or expired, cleaning up...');
    removeAuthTokenClient();
    return null;
  }

  return token;
}