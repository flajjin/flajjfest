import { parseUtcOffset } from "./utils.js";

const CONFIG_URL = "config.json";

export async function loadConfig() {
  const response = await fetch(CONFIG_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load ${CONFIG_URL} (${response.status}).`);
  }

  const config = await response.json();
  const { currentSchedule, utcOffset = "+00:00" } = config;

  return {
    utcOffsetMinutes: parseUtcOffset(utcOffset),
    currentSchedule: typeof currentSchedule === "string" ? currentSchedule.trim() : currentSchedule
  };
}
