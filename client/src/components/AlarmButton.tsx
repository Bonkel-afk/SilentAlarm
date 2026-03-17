import React, { useCallback, useRef } from "react"
import { socket } from "../socket"

interface AlarmButtonProps {
  userId: string
  roomId: string
}

interface AlarmTypeConfig {
  typeId: string
  name: string
  description: string
  severity: number
  maxSeverity: number
  variant: "fire" | "animal" | "customer"
  icon: React.ReactNode
}

const ALARM_TYPES: AlarmTypeConfig[] = [
  {
    typeId: "fire",
    name: "Brand",
    description: "Feueralarm — sofort evakuieren",
    severity: 5,
    maxSeverity: 5,
    variant: "fire",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    severity: 4,
    maxSeverity: 5,
    variant: "animal",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="4" r="1.5" />
        <circle cx="17" cy="4" r="1.5" />
        <circle cx="4" cy="10" r="1.5" />
        <circle cx="20" cy="10" r="1.5" />
        <path d="M12 8c-3.5 0-6 2.5-6 5.5 0 2 1 3.5 2.5 4.5l1 1.5a1 1 0 0 0 1 .5h3a1 1 0 0 0 1-.5l1-1.5C17 16.5 18 15 18 13.5 18 10.5 15.5 8 12 8z" />
        <line x1="10" y1="14" x2="10" y2="14" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="14" y1="14" x2="14" y2="14" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    typeId: "customer",
    name: "Kunde",
    description: "Kunde ben\u00F6tigt Unterst\u00FCtzung",
    severity: 2,
    maxSeverity: 5,
    variant: "customer",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

function SeverityDots({ filled, total }: { filled: number; total: number }) {
  return (
    <div className="alarm-trigger-severity">
      <span className="severity-label">Stufe</span>
      <div className="severity-dots">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`severity-dot ${i < filled ? "severity-dot--filled" : ""}`} />
        ))}
      </div>
    </div>
  )
}

export default function AlarmButton({ userId, roomId }: AlarmButtonProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

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

      socket.emit("alarm:create", { typeId, userId, roomId })
    },
    [userId, roomId]
  )

  return (
    <div className="alarm-buttons">
      {ALARM_TYPES.map((alarm, idx) => (
        <button
          key={alarm.typeId}
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
          <SeverityDots filled={alarm.severity} total={alarm.maxSeverity} />
        </button>
      ))}
    </div>
  )
}
