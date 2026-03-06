# SilentAlarm

SilentAlarm ist eine **Electron + React + Node.js Anwendung**, die Alarme in Echtzeit zwischen Clients und einem Server über **Socket.IO** synchronisiert.
Das Projekt besteht aus drei Hauptteilen:

* **Electron Main Process** (Desktop Anwendung)
* **Client** (React + Vite Frontend)
* **Server** (Node.js Backend)
* **Shared Types** (gemeinsame TypeScript Typen)

---

# Voraussetzungen

Stelle sicher, dass folgende Software installiert ist:

* **Node.js** (empfohlen: ≥ 18)
* **npm**
* **Git**

Download:

* https://nodejs.org
* https://git-scm.com

---

# Repository klonen

```bash
git clone https://github.com/Bonkel-afk/SilentAlarm.git
cd SilentAlarm
```

---

# Installation der Abhängigkeiten

Die Abhängigkeiten müssen für **Root**, **Client** und **Server** installiert werden.

## Root (Electron)

```bash
npm install
```

## Client

```bash
cd client
npm install
cd ..
```

## Server

```bash
cd server
npm install
cd ..
```

---

# Entwicklungsmodus starten

Für die Entwicklung müssen **Server**, **Client** und **Electron** gestartet werden.

## 1. Server starten

```bash
cd server
npm run dev
```

Der Server startet standardmäßig auf:

```
http://localhost:3000
```

---

## 2. Client starten

In einem neuen Terminal:

```bash
cd client
npm run dev
```

Der React Client läuft typischerweise auf:

```
http://localhost:5173
```

---

## 3. Electron starten

In einem dritten Terminal im **Projektroot**:

```bash
npm start
```

Electron öffnet dann die Desktop-Anwendung und lädt den React Client.

---

# Projektstruktur

```
SilentAlarm
│
├── client          # React Frontend (Vite)
│
├── server          # Node.js Backend
│
├── shared          # Gemeinsame TypeScript Typen
│
├── main.js         # Electron Main Process
│
├── package.json
└── README.md
```

---

# Produktions-Build (optional)

Client bauen:

```bash
cd client
npm run build
```

Danach kann Electron die gebauten Dateien laden.

---

# Entwicklung

Empfohlene Tools:

* VSCode
* ESLint
* TypeScript

---

# Lizenz

Dieses Projekt steht unter der MIT-Lizenz.
