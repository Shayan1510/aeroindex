// Every service function is wrapped through here so that swapping between
// mock data and the real backend never touches any page/component — they
// already treat every service call as async.

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

const MOCK_LATENCY_MS = 350;

export function resolveMock(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_LATENCY_MS);
  });
}

/**
 * Fetches JSON from the real backend.
 * @param {string} path - path relative to API_BASE, e.g. "/flights?from=DEL&to=BOM&date=2026-01-01"
 * @param {RequestInit} [options]
 */
export async function fetchJson(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}
