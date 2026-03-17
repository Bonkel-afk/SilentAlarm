import React, { useCallback, useRef, useState } from "react"
import { socket } from "../socket"

interface AlarmTriggerProps {
  userId: string
  roomId: string
  connectedUsers: string[]
}

interface AlarmTypeConfig {
  typeId: string
  name: string
  description: string
  variant: "fire" | "animal" | "customer"
  icon: React.ReactNode
}

const ALARM_TYPES: AlarmTypeConfig[] = [
  {
    typeId: "fire",
    name: "Brand",
    description: "Feueralarm -- sofort evakuieren",
    variant: "fire",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 0-4 4-4 8a4 4 0 0 0 8 0c0-4-4-8-4-8z" />
        <path d="M12 10c0 0-2 2-2 4a2 2 0 0 0 4 0c0-2-2-4-2-4z" />
        <path d="M5 20h14" />
      </svg>
    ),
  },
  {
    typeId: "animal",
    name: "Tier",
    description: "Tier braucht sofortige Hilfe",
    variant: "animal",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="4" r="1.5" />
        <circle cx="17" cy="4" r="1.5" />
        <circle cx="4" cy="10" r="1.5" />
        <circle cx="20" cy="10" r="1.5" />
        <path d="M12 8c-3.5 0-6 2.5-6 5.5 0 2 1 3.5 2.5 4.5l1 1.5a1 1 0 0 0 1 .5h3a1 1 0 0 0 1-.5l1-1.5C17 16.5 18 15 18 13.5 18 10.5 15.5 8 12 8z" />
      </svg>
    ),
  },
  {
    typeId: "customer",
    name: "Kunde",
    description: "Kunde ben\u00F6tigt Unterst\u00FCtzung",
    variant: "customer",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

const MAX_NOTES_LENGTH = 120

export default function AlarmTrigger({ userId, roomId, connectedUsers }: AlarmTriggerProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null)
  const [notesText, setNotesText] = useState<Record<string, string>>({})

  const toggleNotes = useCallback((typeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedNotes(prev => prev === typeId ? null : typeId)
  }, [])

  const sendAlarm = useCallback(
    (typeId: string, e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      const ripple = document.createElement("span")
      ripple.className = "ripple"
      ripple.style.left = `${e.clientX - rect.left - 10}px`
      ripple.style.top = `${e.clientY - rect.top - 10}px`
      button.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)

      const notes = notesText[typeId]?.trim() || undefined
      socket.emit("alarm:create", { typeId, userId, roomId, notes })

      // Clear notes and collapse
      setNotesText(prev => ({ ...prev, [typeId]: "" }))
      setExpandedNotes(null)
    },
    [userId, roomId, notesText]
  )

  const handleNotesChange = useCallback((typeId: string, value: string) => {
    if (value.length <= MAX_NOTES_LENGTH) {
      setNotesText(prev => ({ ...prev, [typeId]: value }))
    }
  }, [])

  return (
    <>
      <div className="alarm-buttons">
        {ALARM_TYPES.map((alarm, idx) => (
          <div key={alarm.typeId} className="alarm-trigger-wrap">
            <div className="alarm-trigger-row">
              <button
                ref={(el) => { btnRefs.current[idx] = el }}
                className={`alarm-trigger-btn alarm-trigger-btn--${alarm.variant}`}
                onClick={(e) => sendAlarm(alarm.typeId, e)}
                type="button"
                aria-label={`${alarm.name} Alarm ausl\u00F6sen`}
              >
                <div className={`alarm-trigger-icon alarm-trigger-icon--${alarm.variant}`}>
                  {alarm.icon}
                </div>
                <div className="alarm-trigger-text">
                  <span className="alarm-trigger-name">{alarm.name}</span>
                  <span className="alarm-trigger-desc">{alarm.description}</span>
                </div>
              </button>
              <button
                className={`notes-toggle ${expandedNotes === alarm.typeId ? "notes-toggle--open" : ""}`}
                onClick={(e) => toggleNotes(alarm.typeId, e)}
                type="button"
                aria-label="Notiz hinzuf\u00FCgen"
              >
                +
              </button>
            </div>

            {expandedNotes === alarm.typeId && (
              <div className="notes-input-area">
                <textarea
                  className="notes-textarea"
                  placeholder="Notiz hinzuf\u00FCgen (optional)..."
                  value={notesText[alarm.typeId] || ""}
                  onChange={(e) => handleNotesChange(alarm.typeId, e.target.value)}
                  maxLength={MAX_NOTES_LENGTH}
                  rows={2}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="notes-char-count">
                  {(notesText[alarm.typeId] || "").length}/{MAX_NOTES_LENGTH}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {connectedUsers.length > 0 && (
        <div className="online-section">
          <div className="online-section-header">
            <span className="online-section-label">Online</span>
            <span className="online-section-count">{connectedUsers.length}</span>
          </div>
          <div className="online-users-list">
            {connectedUsers.map(user => (
              <span key={user} className="online-user-chip">
                <span className="online-user-dot" />
                {user}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
