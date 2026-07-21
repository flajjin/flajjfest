import { renderSchedule, showMessage, updateClock } from "./render.js";
import { loadConfig } from "./config-loader.js";
import { loadSchedule } from "./schedule-loader.js";
import { createFormatters, getDetectedTimeZone } from "./utils.js";

let schedule = {
  title: "Event Schedule",
  logo: "img/logo.svg",
  colors: {},
  events: []
};
let hasActiveSchedule = false;

const NO_SCHEDULE_MESSAGE = "Nothing Scheduled at the moment, come back later";
const detectedTimeZone = getDetectedTimeZone();
const formatters = createFormatters(detectedTimeZone);
const scheduleList = document.querySelector("#schedule-list");
const scheduleTitle = document.querySelector("#schedule-title");
const siteLogo = document.querySelector("#site-logo");
const localClock = document.querySelector("#local-clock");

const COLOR_VARIABLES = {
  textHighlight: ["--text-highlight"],
  active: ["--current"],
  activeBackground: ["--current-background"],
  finished: ["--past"],
  textSecondary: ["--text-secondary"],
  shadow: ["--shadow-color"],
  hover: ["--hover"],
  border: ["--line"],
  background: ["--bg"],
  surface: ["--panel"],
  textPrimary: ["--text-primary"]
};

function renderCurrentSchedule() {
  if (!hasActiveSchedule) {
    showMessage(scheduleList, NO_SCHEDULE_MESSAGE);
    return;
  }

  renderSchedule(schedule.events, scheduleList, formatters);
}

function applyScheduleColors(colors) {
  if (!colors || typeof colors !== "object") {
    return;
  }

  const rootStyle = document.documentElement.style;

  for (const [key, variableNames] of Object.entries(COLOR_VARIABLES)) {
    const value = colors[key];

    if (typeof value === "string" && CSS.supports("color", value)) {
      for (const variableName of variableNames) {
        rootStyle.setProperty(variableName, value);
      }
    }
  }
}

function applyScheduleMetadata() {
  applyScheduleColors(schedule.colors);
  scheduleTitle.textContent = schedule.title;
  document.title = schedule.title;

  if (schedule.logo) {
    siteLogo.src = schedule.logo;
    siteLogo.alt = `${schedule.title} logo`;
    siteLogo.hidden = false;
  } else {
    siteLogo.hidden = true;
  }
}

async function init() {
  updateClock(localClock, formatters.clock);
  setInterval(() => updateClock(localClock, formatters.clock), 1000);

  showMessage(scheduleList, "Loading schedule...");

  try {
    const config = await loadConfig();

    if (!config.currentSchedule) {
      hasActiveSchedule = false;
      renderCurrentSchedule();
      return;
    }

    schedule = await loadSchedule(config.currentSchedule, config.utcOffsetMinutes);
    hasActiveSchedule = true;
    applyScheduleMetadata();
    renderCurrentSchedule();
  } catch (error) {
    hasActiveSchedule = false;
    showMessage(scheduleList, error.message, true);
  }

  setInterval(renderCurrentSchedule, 60000);
}

init();
