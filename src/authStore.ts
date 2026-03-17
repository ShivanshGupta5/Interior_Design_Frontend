import { jwtDecode } from "jwt-decode";

const KEY = "token";

export function setToken(t: string) { localStorage.setItem(KEY, t); }
export function getToken() { return localStorage.getItem(KEY); }
export function clearToken() { localStorage.removeItem(KEY); }
export function isLoggedIn() { return !!getToken(); }

export function getEmailFromToken(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.email || null;
  } catch {
    return null;
  }
}
