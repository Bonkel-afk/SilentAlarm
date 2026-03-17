import React, { useEffect, useState, useMemo } from "react"
import { socket } from "../socket"
import type { Alarm } from "../../../shared/types/alarm"
import { AlarmCard } from "./AlarmCard"
import { playAlarmSound } from "../alarm-sound"

const ShieldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const HistoryIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export const AlarmFeed: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [connectedUsers, setConnectedUsers] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"active" | "history">("active")
  const [, setTick] = useState(0)

  useEffect(() => {
    const onSync = (synced: Alarm[]) => {
      setAlarms(synced.slice().reverse())
    }
    const onNew = (alarm: Alarm) => {
      setAlarms(prev => [alarm, ...prev])
      playAlarmSound()
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { ipcRenderer } = (window as any).require("electron")
        ipcRenderer.send("alarm:trigger")
      } catch {
        // running in browser (no Electron) -- ignore
      }
    }
    const onUpdate = (updated: Alarm) => {
      setAlarms(prev => prev.map(a => a.id === updated.id ? updated : a))
    }
    const onUserList = (users: string[]) => {
      setConnectedUsers(users)
    }

    socket.on("alarm:sync", onSync)
    socket.on("alarm:new", onNew)
    socket.on("alarm:update", onUpdate)
    socket.on("user:list", onUserList)

    return () => {
      socket.off("alarm:sync", onSync)
      socket.off("alarm:new", onNew)
      socket.off("alarm:update", onUpdate)
      socket.off("user:list", onUserList)
    }
  }, [])

  // Tick every 10s for relative timestamps
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 10_000)
    return () => clearInterval(interval)
  }, [])

  const activeAlarms = useMemo(
    () => alarms.filter(a => a.status === "ACTIVE" || a.status === "ACKNOWLEDGED"),
    [alarms]
  )

  const closedAlarms = useMemo(
    () => alarms.filter(a => a.status === "CLOSED"),
    [alarms]
  )

  const activeCount = useMemo(
    () => alarms.filter(a => a.status === "ACTIVE").length,
    [alarms]
  )

  const acknowledgedCount = useMemo(
    () => alarms.filter(a => a.status === "ACKNOWLEDGED").length,
    [alarms]
  )

  const displayedAlarms = activeTab === "active" ? activeAlarms : closedAlarms

  return (
    <>
      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-dot stat-dot--active" />
          <span>Aktiv</span>
          <span className="stat-value stat-value--active">{activeCount}</span>
        </div>
        <span className="stat-separator" />
        <div className="stat-item">
          <span className="stat-dot stat-dot--acknowledged" />
          <span>Best&auml;tigt</span>
          <span className="stat-value stat-value--acknowledged">{acknowledgedCount}</span>
        </div>
        <span className="stat-separator" />
        <div className="stat-item">
          <span className="stat-dot stat-dot--closed" />
          <span>Geschlossen</span>
          <span className="stat-value stat-value--closed">{closedAlarms.length}</span>
        </div>
        <span className="stat-separator" />
        <div className="stat-item">
          <span className="stat-dot stat-dot--online" />
          <span>Online</span>
          <span className="stat-value stat-value--online">{connectedUsers.length}</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === "active" ? "tab-btn--active" : ""}`}
          onClick={() => setActiveTab("active")}
          type="button"
        >
          Aktiv
          <span className={`tab-badge ${activeAlarms.length > 0 ? "tab-badge--active" : "tab-badge--history"}`}>
            {activeAlarms.length}
          </span>
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "tab-btn--active" : ""}`}
          onClick={() => setActiveTab("history")}
          type="button"
        >
          Verlauf
          <span className="tab-badge tab-badge--history">
            {closedAlarms.length}
          </span>
        </button>
      </div>

      {/* Alarm list */}
      <div className="alarm-feed">
        {displayedAlarms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              {activeTab === "active" ? ShieldIcon : HistoryIcon}
            </div>
            <div className="empty-state-title">
              {activeTab === "active" ? "Keine aktiven Alarme" : "Kein Verlauf"}
            </div>
            <div className="empty-state-desc">
              {activeTab === "active"
                ? "Alle Bereiche sind ruhig. Neue Alarme erscheinen hier in Echtzeit."
                : "Geschlossene Alarme werden hier angezeigt."
              }
            </div>
          </div>
        ) : (
          <div className="alarm-list">
            {displayedAlarms.map(alarm => (
              <AlarmCard key={alarm.id} alarm={alarm} connectedUsers={connectedUsers} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
