import { formatUtcOffset, getDateKey, getEventState, getStatusText } from "./utils.js";

function groupEventsByLocalDay(events, dateKeyFormatter) {
  return events.reduce((groups, event) => {
    const key = getDateKey(event.startsAt, dateKeyFormatter);

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(event);
    return groups;
  }, new Map());
}

function createEventCard(event, now, timeFormatter) {
  const state = getEventState(event, now);
  const card = document.createElement("article");
  card.className = `event-card is-${state}`;

  const time = document.createElement("div");
  time.className = "event-time";

  const convertedStart = document.createElement("span");
  convertedStart.textContent = timeFormatter.format(event.startsAt);
  time.append(convertedStart);

  const convertedEnd = document.createElement("span");
  convertedEnd.className = "event-end";
  convertedEnd.textContent = `to ${timeFormatter.format(event.endsAt)}`;
  time.append(convertedEnd);

  const sourceTime = document.createElement("span");
  sourceTime.className = "event-source-time";
  sourceTime.textContent = `(${event.sourceStartTime} - ${event.sourceEndTime}, ${formatUtcOffset(event.sourceUtcOffsetMinutes)})`;
  time.append(sourceTime);

  const details = document.createElement("div");
  details.className = "event-details";

  const title = document.createElement("h2");
  title.className = "event-title";
  title.textContent = event.title;

  const description = document.createElement("p");
  description.className = "event-description";
  description.textContent = event.description;

  const status = document.createElement("div");
  status.className = "event-status";
  status.textContent = getStatusText(state);

  details.append(title);

  if (event.description) {
    details.append(description);
  }

  details.append(status);

  card.append(time, details);
  return card;
}

export function showMessage(scheduleList, message, isError = false) {
  const empty = document.createElement("div");
  empty.className = `empty-state${isError ? " is-error" : ""}`;
  empty.textContent = message;
  scheduleList.replaceChildren(empty);
}

export function renderSchedule(events, scheduleList, formatters) {
  const now = new Date();
  const sortedEvents = [...events].sort((a, b) => a.startsAt - b.startsAt);
  const groups = groupEventsByLocalDay(sortedEvents, formatters.dateKey);
  scheduleList.replaceChildren();

  if (sortedEvents.length === 0) {
    showMessage(scheduleList, "No events are scheduled yet.");
    return;
  }

  for (const eventsInDay of groups.values()) {
    const dayGroup = document.createElement("section");
    dayGroup.className = "day-group";

    const heading = document.createElement("h2");
    heading.className = "day-title";
    heading.textContent = formatters.dateHeading.format(eventsInDay[0].startsAt);

    dayGroup.append(
      heading,
      ...eventsInDay.map((event) => createEventCard(event, now, formatters.time))
    );
    scheduleList.append(dayGroup);
  }
}

export function updateClock(localClock, clockFormatter) {
  localClock.textContent = clockFormatter.format(new Date());
}
