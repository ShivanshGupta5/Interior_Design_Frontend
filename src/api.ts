// import { getEmailFromToken } from "./authStore";

// const envBase = import.meta.env.VITE_API_BASE_URL?.trim();

// export const API_BASE =
//   envBase && envBase.length > 0
//     ? envBase
//     : `${window.location.protocol}//${window.location.hostname}:8001`;

// export async function postForm(path: string, form: FormData) {
//   const email = getEmailFromToken();
//   if (email) form.append("email", email);

//   const res = await fetch(`${API_BASE}${path}`, {
//     method: "POST",
//     body: form,
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data?.detail ?? "Request failed");
//   return data;
// }

// export async function requestSignup(email: string, password: string) {
//   const res = await fetch(`${API_BASE}/auth/request-signup`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data?.detail ?? "Verification failed");
//   return data;
// }

// export async function signup(email: string, password: string, otp: string) {
//   const res = await fetch(`${API_BASE}/auth/signup`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password, otp }),
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data?.detail ?? "Signup failed");
//   return data;
// }

// export async function getMe() {
//   const email = getEmailFromToken();
//   if (!email) return null;

//   const res = await fetch(`${API_BASE}/auth/me?email=${encodeURIComponent(email)}`);
//   const data = await res.json();
//   if (!res.ok) throw new Error(data?.detail ?? "Failed to fetch profile");
//   return data;
// }

// export async function signin(email: string, password: string) {
//   const res = await fetch(`${API_BASE}/auth/signin`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data?.detail ?? "Signin failed");
//   return data as { access_token: string };
// }

import { getEmailFromToken } from "./authStore";

const envBase = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE =
  envBase && envBase.length > 0
    ? envBase
    : `${window.location.protocol}//${window.location.hostname}:8001`;

export async function postForm(path: string, form: FormData) {
  const email = getEmailFromToken();
  if (email) form.append("email", email);

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail ?? "Request failed");
  return data;
}

export async function getRunStatus(runId: string) {
  const res = await fetch(`${API_BASE}/run/status/${encodeURIComponent(runId)}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data?.detail ?? "Failed to fetch run status");
  return data as {
    run_id?: string;
    status: "queued" | "running" | "completed" | "failed";
    result_url?: string | null;
    error?: string | null;
  };
}

export async function waitForRunCompletion(
  runId: string,
  options?: {
    intervalMs?: number;
    maxAttempts?: number;
  }
) {
  const intervalMs = options?.intervalMs ?? 3000;
  const maxAttempts = options?.maxAttempts ?? 240; // ~12 minutes

  let attempts = 0;

  while (attempts < maxAttempts) {
    const data = await getRunStatus(runId);

    if (data.status === "completed") {
      return data;
    }

    if (data.status === "failed") {
      throw new Error(data.error ?? "Pipeline execution failed");
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    attempts += 1;
  }

  throw new Error("Generation is taking too long. Please try again in a moment.");
}

export async function requestSignup(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/request-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail ?? "Verification failed");
  return data;
}

export async function signup(email: string, password: string, otp: string) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, otp }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail ?? "Signup failed");
  return data;
}

export async function getMe() {
  const email = getEmailFromToken();
  if (!email) return null;

  const res = await fetch(`${API_BASE}/auth/me?email=${encodeURIComponent(email)}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data?.detail ?? "Failed to fetch profile");
  return data;
}

export async function signin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail ?? "Signin failed");

  return data as { access_token: string };
}