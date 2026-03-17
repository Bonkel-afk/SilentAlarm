---
name: SilentAlarm UI Design
description: Design decisions and tech stack for the SilentAlarm veterinary clinic real-time alarm dashboard (Electron + React + TypeScript + Vite)
type: project
---

SilentAlarm is a real-time alarm system for a veterinary clinic, built as an Electron desktop app with React + TypeScript + Vite.

**Why:** Clinic staff need a mission-critical dashboard to trigger and monitor alarms in real-time across rooms.

**How to apply:**
- Dark clinical theme: base #0d1117, surface #161b22, cards #1c2333
- Status colors: ACTIVE = red #ef4444 (pulsing), ACKNOWLEDGED = amber #f59e0b, CLOSED = gray #6b7280
- Font: Inter (Google Fonts import) with system-ui fallback
- German language UI labels (Notfall, Hilfe, Aktiv, Bestätigt, etc.)
- Socket.io for real-time: emit "alarm:create", listen "alarm:new"
- No external CSS frameworks - pure CSS with custom properties for theming
- Alarm types: emergency (critical/dark red), help (high/red), info (low/blue)
- Layout: 2-column grid - left sidebar for triggers (380px), right panel for alarm list
- CSS animations for active alarm pulse, slide-in cards, ripple on button press
