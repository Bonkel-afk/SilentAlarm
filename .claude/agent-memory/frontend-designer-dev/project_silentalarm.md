---
name: SilentAlarm UI Design
description: Design decisions and tech stack for the SilentAlarm veterinary clinic real-time alarm dashboard (Electron + React + TypeScript + Vite)
type: project
---

SilentAlarm is a real-time alarm system for a veterinary clinic, built as an Electron desktop app with React + TypeScript + Vite.

**Why:** Clinic staff need a mission-critical dashboard to trigger and monitor alarms in real-time across rooms.

**How to apply:**
- Dark ops-dashboard theme: base #080c14, surface #0d1220, cards #111827
- Status colors: ACTIVE = red #ef4444 (pulsing glow), ACKNOWLEDGED = amber #f59e0b, CLOSED = green #22c55e
- Accent: indigo #6366f1 for interactive elements, login, focus states
- Font: Inter (Google Fonts import) with system-ui fallback
- German language UI labels (Brand, Tier, Kunde, Aktiv, Verlauf, etc.)
- Socket.io for real-time: emit "alarm:create" (with optional notes), "alarm:ack", "alarm:close"
- Listen: "alarm:sync", "alarm:new", "alarm:update", "user:list"
- No external CSS frameworks - pure CSS with custom properties for theming
- Alarm types: fire/Brand (orange), animal/Tier (amber), customer/Kunde (blue)
- Layout: 2-column grid - left sidebar 320px for triggers + online users, right panel for alarm feed
- Components renamed: AlarmButton -> AlarmTrigger, AlarmList -> AlarmFeed
- Features: alarm notes (optional 120-char text), close alarm button, tabs (Aktiv/Verlauf), stats bar
- Alarm card: left color stripe, notes callout, ack roster, close button for sender/acknowledged
- CSS animations: glow-pulse for active cards, stripe-pulse, slide-in, expand-notes
- Header: 56px, blurred backdrop, compact with indigo logo
- Blurred backdrop header with 85% opacity background
