export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

// Reads the logged-in user saved by the login/register pages.
// Safe to call on the server too — returns null if window isn't available.
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Clears the saved session. Call this on logout.
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}