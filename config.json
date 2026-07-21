# Event Schedule

A small static webpage for GitHub Pages that converts event times into each visitor's local time zone.

## Root Config

Edit `config.json` to choose the schedule's fixed UTC offset and the active schedule file:

```json
{
  "utcOffset": "-05:00",
  "currentSchedule": "flajjFestSummer26.json"
}
```

### UTC Offset

UTC (Coordinated Universal Time) is the common worldwide time baseline. `utcOffset` describes how far the schedule's written times are ahead of or behind UTC.

The value must use the signed `+HH:MM` or `-HH:MM` format:

- `+00:00`: UTC
- `-05:00`: five hours behind UTC
- `+02:00`: two hours ahead of UTC
- `+05:30`: five hours and thirty minutes ahead of UTC

Named zones and abbreviations such as `EST`, `Europe/Berlin`, or `UTC+2` are not supported.

The offset is fixed and does not change automatically for daylight saving time. For example, US Eastern time is normally `-05:00` in winter and `-04:00` in summer. Set the offset that applies on the schedule dates.

### Active Schedule

`currentSchedule` is the file to load from the `schedules/` folder. For example, `"flajjFestSummer26.json"` loads `schedules/flajjFestSummer26.json`.

Set `currentSchedule` to `null` or `""` to show:

```text
Nothing Scheduled at the moment, come back later
```

## Schedule File

Each schedule file is a JSON object with a title, logo, optional colors, and events:

```json
{
  "title": "Summer '26",
  "logo": "img/logo.svg",
  "colors": {
    "textHighlight": "rgb(15, 118, 110)",
    "active": "rgb(180, 83, 9)",
    "activeBackground": "rgb(255, 250, 242)",
    "finished": "rgb(135, 145, 141)",
    "textSecondary": "rgb(102, 115, 111)",
    "shadow": "rgb(24 33 31 / 0.12)",
    "hover": "rgb(242, 250, 248)",
    "border": "rgb(217, 227, 224)",
    "background": "rgb(244, 247, 246)",
    "surface": "rgb(255, 255, 255)",
    "textPrimary": "rgb(24, 33, 31)"
  },
  "events": [
    {
      "title": "Opening Session",
      "description": "Welcome remarks and event overview.",
      "date": "2026-08-15",
      "startTime": "11:00",
      "endTime": "18:00"
    }
  ]
}
```

Put logo files in `img/`. The `logo` value can be `img/logo.svg` or just `logo.svg`.

For each event, `title`, `date`, `startTime`, and `endTime` are required. `description` is optional.

## Colors

The `colors` object supports eleven keys:

- `textHighlight`: highlight color for event titles and upcoming event borders
- `active`: accent color for the current event's border
- `activeBackground`: background color for the current event
- `finished`: accent color for finished event borders
- `textSecondary`: secondary text color used for labels, descriptions, and end times
- `shadow`: color of the schedule panel's shadow
- `hover`: event-card background color on hover
- `border`: color of panel, header, clock-card, event-card, and empty-state borders
- `background`: page background
- `surface`: panel and event-card background
- `textPrimary`: main text color used for body text and primary times

Any missing color uses the default from `css/styles.css`.

## Event Times

Use `YYYY-MM-DD` for `date` and 24-hour `HH:MM` for `startTime` and `endTime`.

The page converts those times from `config.json`'s `utcOffset` into the visitor's browser time zone. For example, `11:00` at `-05:00` is `16:00` UTC; a visitor at `+02:00` sees `18:00`.

The original schedule time and its offset are shown underneath in brackets, like `(11:00 - 18:00, UTC-05:00)`.

If `endTime` is earlier than `startTime`, it is treated as ending the next day.

## Code Layout

- `js/app.js` starts the page.
- `js/config-loader.js` loads `config.json`.
- `js/schedule-loader.js` loads and validates the active schedule.
- `js/render.js` renders the schedule UI.
- `js/utils.js` contains UTC-offset conversion, local time-zone formatting, and event status helpers.
- `img/` contains schedule logos displayed in the panel header.

## Local Preview

Because the page loads JSON files, preview it through a local server instead of opening `index.html` directly:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

1. Push these files to a GitHub repository.
2. In the repository, open **Settings > Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Choose the branch and the root folder.
5. Save the setting and open the Pages URL after GitHub finishes deploying.
