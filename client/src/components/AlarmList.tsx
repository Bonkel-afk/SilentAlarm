import React, { useEffect, useState, useMemo } from "react"
import { socket } from "../socket"
import type { Alarm } from "../../../shared/types/alarm"
import { AlarmCard } from "./AlarmCard"

const ShieldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const ListIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

export const AlarmList: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [connectedUsers, setConnectedUsers] = useState<string[]>([])
  const [, setTick] = useState(0)

  useEffect(() => {
    const onSync = (synced: Alarm[]) => {
      setAlarms(synced.slice().reverse()) // newest first
    }
    const onNew = (alarm: Alarm) => {
      setAlarms(prev => [alarm, ...prev])
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

  // Tick every 10s to refresh relative timestamps
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 10_000)
    return () => clearInterval(interval)
  }, [])

  const activeCount = useMemo(
    () => alarms.filter(a => a.status === "ACTIVE").length,
    [alarms]
  )

  return (
    <>
      <div className="alarms-panel-header">
        <div className="alarms-panel-title">
          {ListIcon}
          <h2>Alarme</h2>
        </div>
        <div className="alarms-panel-header-right">
          {connectedUsers.length > 0 && (
            <span className="online-count">
              <span className="online-dot" />
              {connectedUsers.length} online
            </span>
          )}
          <span className={`alarm-count ${activeCount > 0 ? "alarm-count--active" : "alarm-count--zero"}`}>
            {alarms.length}
          </span>
        </div>
      </div>

      {alarms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{ShieldIcon}</div>
          <div className="empty-state-title">Keine Alarme</div>
          <div className="empty-state-desc">
            Alle Bereiche sind ruhig. Neue Alarme erscheinen hier in Echtzeit.
          </div>
        </div>
      ) : (
        <div className="alarm-list">
          {alarms.map(alarm => (
            <AlarmCard key={alarm.id} alarm={alarm} connectedUsers={connectedUsers} />
          ))}
        </div>
      )}
    </>
  )
}
