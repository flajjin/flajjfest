export function getDetectedTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function parseUtcOffset(utcOffset) {
  const value = String(utcOffset).trim();
  const match = value.match(/^([+-])(\d{2}):(\d{2})$/);

  if (!match) {
    throw new Error(`Invalid schedule utcOffset: ${utcOffset}. Expected a value like "+02:00".`);
  }

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3]);

  if (hours > 14 || minutes > 59 || (hours === 14 && minutes !== 0)) {
    throw new Error(`Invalid schedule utcOffset: ${utcOffset}. Expected a value from "-14:00" to "+14:00".`);
  }

  return sign * (hours * 60 + minutes);
}

export function formatUtcOffset(utcOffsetMinutes) {
  const sign = utcOffsetMinutes < 0 ? "-" : "+";
  const absoluteMinutes = Math.abs(utcOffsetMinutes);
  const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, "0");
  const minutes = String(absoluteMinutes % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}

export function createFormatters(timeZone) {
  return {
    dateKey: new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }),
    dateHeading: new Intl.DateTimeFormat(undefined, {
      timeZone,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    time: new Intl.DateTimeFormat(undefined, {
      timeZone,
      hour: "numeric",
      minute: "2-digit"
    }),
    clock: new Intl.DateTimeFormat(undefined, {
      timeZone,
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    })
  };
}

export function getDateKey(date, formatter) {
  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getEventState(event, now) {
  const ends = event.endsAt || event.startsAt;

  if (now >= event.startsAt && now <= ends) {
    return "current";
  }

  if (now > ends) {
    return "past";
  }

  return "upcoming";
}

export function getStatusText(state) {
  if (state === "current") {
    return "Live now";
  }

  if (state === "past") {
    return "Finished";
  }

  return "Upcoming";
}

function parseLocalDateTimeParts(dateTimeText, rowNumber, fieldName) {
  const match = dateTimeText
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);

  if (!match) {
    throw new Error(`Event ${rowNumber} has an invalid ${fieldName} value.`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] || 0),
    minute: Number(match[5] || 0),
    second: Number(match[6] || 0)
  };
}

function dateTimeAtUtcOffsetToDate(parts, utcOffsetMinutes) {
  const utcTime = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return new Date(utcTime - utcOffsetMinutes * 60 * 1000);
}

export function parseDateTimeAtUtcOffset(dateTimeText, utcOffsetMinutes, rowNumber, fieldName) {
  if (!dateTimeText) {
    throw new Error(`Event ${rowNumber} is missing ${fieldName}.`);
  }

  return dateTimeAtUtcOffsetToDate(
    parseLocalDateTimeParts(dateTimeText, rowNumber, fieldName),
    utcOffsetMinutes
  );
}
