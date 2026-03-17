import { useState, useEffect, type FormEvent } from "react"
import { socket } from "./socket"
import AlarmButton from "./components/AlarmButton"
import { AlarmList } from "./components/AlarmList"
import { SessionContext, type Session } from "./context/SessionContext"
import "./App.css"

function getHostname(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const os = (window as any).require?.("os")
    return os?.hostname() ?? window.location.hostname ?? "unbekannt"
  } catch {
    return window.location.hostname || "unbekannt"
  }
}

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [session, setSession] = useState<Session | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [roomInput] = useState(getHostname)

  useEffect(() => {
    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)
    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = nameInput.trim()
    if (!name) return
    socket.emit("user:join", name)
    setSession({ username: name, roomId: roomInput })
  }

  const handleLogout = () => {
    socket.disconnect()
    socket.connect()
    setSession(null)
    setNameInput("")
  }

  if (!session) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="login-brand">SilentAlarm</div>
          <div className="login-subtitle">Veterinary Clinic Alert System</div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
              <label className="login-label" htmlFor="username">Name</label>
              <input
                id="username"
                className="login-input"
                type="text"
                placeholder="Dein Name eingeben..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="room">
                Raum
                <span className="login-label-hint">(PC-Name)</span>
              </label>
              <input
                id="room"
                className="login-input login-input--readonly"
                type="text"
                value={roomInput}
                readOnly
              />
            </div>

            <button className="login-btn" type="submit" disabled={!nameInput.trim()}>
              Anmelden
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <SessionContext.Provider value={session}>
      <div className="app">
        <header className="header">
          <div className="header-brand">
            <div className="header-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <div className="header-title">SilentAlarm</div>
              <div className="header-subtitle">Veterinary Clinic Alert System</div>
            </div>
          </div>

          <div className="header-status">
            <div className="header-user">
              <span className="header-user-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className="header-user-name">{session.username}</span>
              <span className="header-user-sep">·</span>
              <span className="header-user-room">{session.roomId}</span>
            </div>

            <div className={`connection-badge ${isConnected ? "connection-badge--connected" : "connection-badge--disconnected"}`}>
              <span className="connection-dot" />
              {isConnected ? "Verbunden" : "Getrennt"}
            </div>

            <button className="logout-btn" onClick={handleLogout} type="button" aria-label="Abmelden">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </header>

        <main className="main-content">
          <aside className="triggers-panel">
            <div className="panel-header">
              <span className="panel-header-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </span>
              <span className="panel-title">Alarm ausl&ouml;sen</span>
            </div>
            <AlarmButton userId={session.username} roomId={session.roomId} />
          </aside>

          <section className="alarms-panel">
            <AlarmList />
          </section>
        </main>
      </div>
    </SessionContext.Provider>
  )
}

export default App
