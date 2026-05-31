# Trendweight — Weight Tracker

A private, offline-first weight tracking app. You onboard with your height and
current weight, set a goal, then log weigh-ins on any day. The app reveals the
real trend behind daily noise and gives you analytics to stay on track.

Everything is stored **locally in your browser** (localStorage). No account, no
server, no cloud. Export a backup anytime.

## Features

- **Guided onboarding** — units (metric/imperial), height, current weight, goal,
  plus optional sex/age/activity for energy estimates.
- **Smart trend line** — an exponentially weighted moving average (the Hacker's
  Diet method) smooths out water-weight noise to show your true direction.
- **Interactive chart** — daily weigh-ins as dots, the smoothed trend as a line,
  your goal as a reference line, with 1M/3M/6M/1Y/All ranges.
- **Key stats** — trend weight, weekly rate of change, total change, and amount
  remaining to your goal.
- **Goal projection** — estimated date you'll hit your goal at the current pace.
- **BMI** — value, category, a visual scale, and your healthy weight range.
- **Energy estimates** — BMR and TDEE (Mifflin-St Jeor) plus suggested calorie
  targets for mild and steady loss.
- **Consistency** — current and longest logging streaks, total weigh-ins, range.
- **History** — full editable log with per-entry day-over-day change, notes, and
  optional body-fat percentage.
- **Backup & portability** — export/import JSON, export CSV.
- **Polished dark UI** — responsive, works great on phone and desktop.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS v4 · Recharts · date-fns

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build    # type-check and build for production -> dist/
npm run preview  # preview the production build
npm run lint     # type-check only (tsc --noEmit)
```

## How weights are stored

Internally every weight is kept in **kilograms** and height in **centimeters**,
so switching units never loses precision. The unit you pick only affects
display and input.

## Privacy

All data lives in your browser's localStorage under the key
`weight-tracker.state.v1`. Clearing site data or using the in-app "Reset all
data" removes it. Use **Export JSON backup** in Settings to keep a copy.
