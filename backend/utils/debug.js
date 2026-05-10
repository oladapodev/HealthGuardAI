const isDev = process.env.NODE_ENV !== "production";

function emit(ns, message, data) {
  if (!isDev) return;
  const payload = data === undefined ? "" : ` ${JSON.stringify(data)}`;
  console.log(`[${ns}] ${message}${payload}`);
}

export const debug = {
  api: (message, data) => emit("API", message, data),
  ai: (message, data) => emit("AI", message, data),
  feature: (message, data) => emit("FEATURE", message, data),
  env: (message, data) => emit("ENV", message, data),
};
