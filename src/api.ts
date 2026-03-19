// import { getEmailFromToken } from "./authStore";

// const envBase = import.meta.env.VITE_API_BASE_URL?.trim();

// export const API_BASE =
//   envBase && envBase.length > 0
//     ? envBase
//     : `${window.location.protocol}//${window.location.hostname}:8001`;

// export type JobStatusResponse = {
//   job_id: string;
//   type: string;
//   status: "queued" | "running" | "completed" | "failed";
//   message?: string | null;
//   result_url?: string | null;
//   run_id?: string | null;
//   error?: string | null;
//   created_at?: string;
//   updated_at?: string;
// };

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

// export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
//   const res = await fetch(`${API_BASE}/jobs/${jobId}`);
//   const data = await res.json();
//   if (!res.ok) throw new Error(data?.detail ?? "Failed to fetch job status");
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
    ? envBase.replace(/\/$/, "")
    : `${window.location.protocol}//${window.location.hostname}:8001`;

export type JobStatusResponse = {
  job_id: string;
  job_type?: string;
  status: "queued" | "running" | "completed" | "failed";
  message?: string | null;
  result_url?: string | null;
  run_id?: string | null;
  error?: string | null;
  created_at?: string;
  updated_at?: string;
};

async function parseJsonSafely(res: Response) {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response from ${res.url}`);
  }
}

export async function postForm(path: string, form: FormData) {
  const email = getEmailFromToken();
  if (email && !form.has("email")) form.append("email", email);

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: form,
    cache: "no-store",
  });

  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.detail ?? data?.error ?? "Request failed");
  return data;
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  if (!jobId || String(jobId).trim() === "") {
    throw new Error("Missing job_id for status polling");
  }

  const url = new URL(`${API_BASE}/jobs/${encodeURIComponent(jobId)}`);
  url.searchParams.set("_ts", Date.now().toString());

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });

  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.detail ?? data?.error ?? "Failed to fetch job status");
  return data as JobStatusResponse;
}

export async function requestSignup(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/request-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.detail ?? "Verification failed");
  return data;
}

export async function signup(email: string, password: string, otp: string) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, otp }),
    cache: "no-store",
  });

  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.detail ?? "Signup failed");
  return data;
}

export async function getMe() {
  const email = getEmailFromToken();
  if (!email) return null;

  const res = await fetch(`${API_BASE}/auth/me?email=${encodeURIComponent(email)}`, {
    cache: "no-store",
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.detail ?? "Failed to fetch profile");
  return data;
}

export async function signin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.detail ?? "Signin failed");
  return data as { access_token: string };
}
