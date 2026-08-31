// Every mock service function is wrapped through here so that later, when a
// real backend exists, the delay() + resolve pattern becomes a plain fetch()
// call and nothing in any page/component needs to change — they already
// treat every service call as async.

const MOCK_LATENCY_MS = 350;

export function resolveMock(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_LATENCY_MS);
  });
}

// export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
