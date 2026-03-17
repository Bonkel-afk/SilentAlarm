# SilentAlarm

SilentAlarm ist ein **Echtzeit-Alarmsystem für Tierarztpraxen**, gebaut mit Electron, React und Node.js. Mitarbeiter können über eine Desktop-Anwendung Alarme auslösen, die sofort auf allen verbundenen Clients erscheinen und quittiert werden können.

---

## Technologie-Stack

| Schicht | Technologie |
|---|---|
| Desktop-App | Electron |
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + Socket.IO |
| Echtzeit | Socket.IO (WebSockets) |
| Typen (shared) | TypeScript |

---

## Projektstruktur

```
SilentAlarm/
├── main.js              # Electron Main Process
├── package.json         # Root-Abhängigkeiten & Scripts
│
├── client/              # React Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── App.tsx              # Haupt-Komponente (Login + Dashboard)
│   │   ├── socket.ts            # Socket.IO Client-Instanz
│   │   ├── components/
│   │   │   ├── AlarmButton.tsx  # Alarm-Auslöse-Buttons
│   │   │   ├── AlarmCard.tsx    # Einzelne Alarm-Anzeige
│   │   │   └── AlarmList.tsx    # Liste aller aktiven Alarme
│   │   └── context/
│   │       └── SessionContext.tsx  # Benutzer-Session (Name, Raum)
│   └── package.json
│
├── server/              # Node.js Backend
│   ├── src/
│   │   └── app.ts       # Express + Socket.IO Server
│   └── package.json
│
└── shared/              # Gemeinsame TypeScript-Typen
    └── types/
        ├── alarm.ts         # Alarm-Interface & Status-Typen
        ├── alarmType.ts     # AlarmType-Interface
        ├── socket.ts        # Socket.IO Event-Definitionen
        ├── room.ts          # Room-Typ
        └── user.ts          # User-Typ
```

---

## Wie es funktioniert

### Ablauf

1. **Anmeldung** — Der Benutzer gibt seinen Namen ein. Der Raumname wird automatisch aus dem PC-Hostnamen ermittelt.
2. **Verbindung** — Der Client verbindet sich per Socket.IO mit dem Server (`localhost:3000`) und sendet `user:join`.
3. **Alarm auslösen** — Ein Klick auf einen Alarm-Button sendet `alarm:create` an den Server.
4. **Echtzeit-Broadcast** — Der Server speichert den Alarm (In-Memory) und sendet `alarm:new` an **alle** verbundenen Clients.
5. **Quittierung** — Ein Benutzer klickt auf "Quittieren" → `alarm:ack` → Server setzt Status auf `ACKNOWLEDGED` und broadcastet `alarm:update`.
6. **Neuer Client** — Wer sich neu verbindet, erhält sofort alle aktuellen Alarme per `alarm:sync`.

### Alarm-Typen

| Typ | Name | Schweregrad |
|---|---|---|
| `fire` | Brand | 5/5 — Sofort evakuieren |
| `animal` | Tier | 4/5 — Tier braucht Hilfe |
| `customer` | Kunde | 2/5 — Kunde benötigt Unterstützung |

### Alarm-Status

- `ACTIVE` — Alarm wurde ausgelöst, noch nicht quittiert
- `ACKNOWLEDGED` — Mindestens ein Benutzer hat quittiert
- `CLOSED` — Alarm geschlossen

### Socket.IO Events

**Client → Server:**
| Event | Payload | Beschreibung |
|---|---|---|
| `user:join` | `username: string` | Benutzer tritt bei |
| `alarm:create` | `{ typeId, userId, roomId }` | Neuen Alarm erstellen |
| `alarm:ack` | `alarmId: string` | Alarm quittieren |

**Server → Client:**
| Event | Payload | Beschreibung |
|---|---|---|
| `alarm:new` | `Alarm` | Neuer Alarm für alle |
| `alarm:update` | `Alarm` | Alarm-Status geändert |
| `alarm:sync` | `Alarm[]` | Alle Alarme beim Verbinden |
| `user:list` | `string[]` | Aktuelle Benutzerliste |

---

## Voraussetzungen

- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org)
- **npm**
- **Git** — [git-scm.com](https://git-scm.com)

---

## Installation

```bash
# Repository klonen
git clone https://github.com/Bonkel-afk/SilentAlarm.git
cd SilentAlarm

# Alle Abhängigkeiten installieren (Root + Client + Server)
npm install
npm install --prefix client
npm install --prefix server
```

---

## Entwicklungsmodus starten

Ein einziger Befehl startet **Server, Client und Electron** gleichzeitig:

```bash
npm run dev
```

Dieser Befehl führt parallel aus:
- Server auf `http://localhost:3000`
- React-Client auf `http://localhost:5173`
- Electron (wartet auf den Client, öffnet dann die Desktop-App)

> Alternativ können die drei Prozesse einzeln gestartet werden:
> ```bash
> # Terminal 1 — Server
> cd server && npm run dev
>
> # Terminal 2 — Client
> cd client && npm run dev
>
> # Terminal 3 — Electron (im Projektroot)
> npm start
> ```

---

## Produktions-Build

```bash
# Client bauen
npm run build

# Electron-Installer/AppImage erstellen
npm run dist
```

Die fertige Anwendung landet im Ordner `release/`.

**Build-Targets:**
- Windows: NSIS Installer (`.exe`)
- Linux: AppImage
- macOS: DMG

---

## Mehrere Clients verbinden

Da der Server In-Memory läuft, müssen alle Clients im selben Netzwerk den **Server-Rechner** als Host kennen. Standardmäßig verbindet sich der Client zu `localhost:3000` — für ein Netzwerk-Setup muss die Server-URL in [client/src/socket.ts](client/src/socket.ts) angepasst werden.

---

## Empfohlene Tools

- **VSCode** mit ESLint- und TypeScript-Extensions
- **Electron DevTools** — öffnen sich im Dev-Modus automatisch

---

## Lizenz

MIT
