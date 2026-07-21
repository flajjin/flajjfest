import { parseDateTimeAtUtcOffset } from "./utils.js";

function getScheduleUrl(scheduleName) {
  if (typeof scheduleName !== "string" || !scheduleName.trim()) {
    return "";
  }

  const normalizedName = scheduleName.trim().replaceAll("\\", "/");

  if (
    normalizedName.startsWith("/") ||
    normalizedName.includes("..") ||
    normalizedName.includes("://")
  ) {
    throw new Error("currentSchedule must be a file name inside the schedules folder.");
  }

  return `schedules/${normalizedName}`;
}

function getLogoPath(logo) {
  if (typeof logo !== "string" || !logo.trim()) {
    return "";
  }

  const normalizedLogo = logo.trim().replaceAll("\\", "/");

  if (
    normalizedLogo.startsWith("/") ||
    normalizedLogo.includes("..") ||
    normalizedLogo.includes("://")
  ) {
    throw new Error("Schedule logo must be a file path inside this site.");
  }

  return normalizedLogo.includes("/") ? normalizedLogo : `img/${normalizedLogo}`;
}

function addDays(dateText, days) {
  const [year, month, day] = dateText.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function getRequiredString(value, label, rowNumber) {
  if (typeof value !== "string" || !value.trim()) {
    const prefix = rowNumber ? `Event ${rowNumber}` : "Schedule";
    throw new Error(`${prefix} is missing ${label}.`);
  }

  return value.trim();
}

function parseEvent(event, index, scheduleUtcOffsetMinutes) {
  const rowNumber = index + 1;
  const title = getRequiredString(event.title, "title", rowNumber);
  const sourceDate = getRequiredString(event.date, "date", rowNumber);
  const sourceStartTime = getRequiredString(event.startTime, "startTime", rowNumber);
  const sourceEndTime = getRequiredString(event.endTime, "endTime", rowNumber);
  const startsAt = parseDateTimeAtUtcOffset(
    `${sourceDate}T${sourceStartTime}`,
    scheduleUtcOffsetMinutes,
    rowNumber,
    "startTime"
  );
  let endsAt = parseDateTimeAtUtcOffset(
    `${sourceDate}T${sourceEndTime}`,
    scheduleUtcOffsetMinutes,
    rowNumber,
    "endTime"
  );

  if (endsAt < startsAt) {
    endsAt = parseDateTimeAtUtcOffset(
      `${addDays(sourceDate, 1)}T${sourceEndTime}`,
      scheduleUtcOffsetMinutes,
      rowNumber,
      "endTime"
    );
  }

  return {
    title,
    description: event.description || "",
    startsAt,
    endsAt,
    sourceDate,
    sourceStartTime,
    sourceEndTime,
    sourceUtcOffsetMinutes: scheduleUtcOffsetMinutes
  };
}

function parseScheduleItems(items, scheduleUrl, scheduleUtcOffsetMinutes) {
  if (!Array.isArray(items)) {
    throw new Error(`${scheduleUrl} must contain an events array.`);
  }

  return items.map((event, index) => parseEvent(event, index, scheduleUtcOffsetMinutes));
}

function parseScheduleDocument(document, scheduleUrl, scheduleUtcOffsetMinutes) {
  if (!document || typeof document !== "object") {
    throw new Error(`${scheduleUrl} must contain a schedule object.`);
  }

  return {
    title: getRequiredString(document.title, "title"),
    logo: getLogoPath(getRequiredString(document.logo, "logo")),
    colors: document.colors && typeof document.colors === "object" ? document.colors : {},
    events: parseScheduleItems(document.events, scheduleUrl, scheduleUtcOffsetMinutes)
  };
}

export async function loadSchedule(scheduleName, scheduleUtcOffsetMinutes) {
  const scheduleUrl = getScheduleUrl(scheduleName);
  const response = await fetch(scheduleUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load ${scheduleUrl} (${response.status}).`);
  }

  return parseScheduleDocument(await response.json(), scheduleUrl, scheduleUtcOffsetMinutes);
}
