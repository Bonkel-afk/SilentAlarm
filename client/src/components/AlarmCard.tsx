import { socket } from "../socket"
import { useSession } from "../context/SessionContext"
import type { Alarm, AlarmStatus } from "../../../shared/types/alarm"

// --- Helpers ---

const TYPE_LABELS: Record<string, string> = {
  fire: "Brand",
  animal: "Tier",
  customer: "Kunde",
}

function timeAgo(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 5) return "gerade eben"
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ${minutes % 60}m`
  return `${Math.floor(hours / 24)}d`
}

function statusClass(status: AlarmStatus): string {
  switch (status) {
    case "ACTIVE": return "active"
    case "ACKNOWLEDGED": return "acknowledged"
    case "CLOSED": return "closed"
  }
}

function statusLabel(status: AlarmStatus): string {
  switch (status) {
    case "ACTIVE": return "Aktiv"
    case "ACKNOWLEDGED": return "Best\u00E4tigt"
    case "CLOSED": return "Geschlossen"
  }
}

// --- Icons ---

const Icons = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  room: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  checkCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  clock2: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
}

// --- Component ---

interface AlarmCardProps {
  alarm: Alarm
  connectedUsers: string[]
}

export function AlarmCard({ alarm, connectedUsers }: AlarmCardProps) {
  const session = useSession()
  const sc = statusClass(alarm.status)
  const typeVariant = alarm.typeId as "fire" | "animal" | "customer"

  const isSender = alarm.userId === session.username
  const hasAcked = alarm.acknowledgedBy.includes(session.username)
  const canAck = !isSender && !hasAcked && alarm.status !== "CLOSED"

  // Other users (everyone except sender) that we track for ack status
  const respondents = connectedUsers.filter(u => u !== alarm.userId)

  const handleAck = () => {
    socket.emit("alarm:ack", alarm.id)
  }

  return (
    <article
      className={`alarm-card alarm-card--${sc}`}
      role="alert"
      aria-live={alarm.status === "ACTIVE" ? "assertive" : "polite"}
    >
      {/* Color stripe */}
      <div className="alarm-card-stripe" />

      {/* Card body */}
      <div className="alarm-card-body">
        {/* Top row: type + status + ack button */}
        <div className="alarm-card-top">
          <div className="alarm-card-type">
            <span
              className={`alarm-type-dot alarm-type-dot--${typeVariant} ${
                alarm.status === "ACTIVE" ? "alarm-type-dot--active" : ""
              }`}
            />
            <span className="alarm-type-name">
              {TYPE_LABELS[alarm.typeId] ?? alarm.typeId}
            </span>
          </div>

          <div className="alarm-card-top-right">
            {canAck && (
              <button className="alarm-ack-btn" onClick={handleAck} type="button">
                {Icons.check}
                Bestätigen
              </button>
            )}
            {!canAck && hasAcked && (
              <span className="alarm-self-acked">
                {Icons.checkCircle}
                Bestätigt
              </span>
            )}
            <span className={`status-badge status-badge--${sc}`}>
              <span className="status-dot" />
              {statusLabel(alarm.status)}
            </span>
          </div>
        </div>

        {/* Metadata row */}
        <div className="alarm-card-meta">
          <span className="alarm-meta-item">
            {Icons.user}
            {alarm.userId}
          </span>
          <span className="meta-separator" />
          <span className="alarm-meta-item">
            {Icons.room}
            {alarm.roomId}
          </span>
          <span className="meta-separator" />
          <span className="alarm-meta-item alarm-meta-item--time">
            {Icons.clock}
            {timeAgo(alarm.createdAt)}
          </span>
        </div>

        {/* Acknowledgment roster — shown when there are other users online */}
        {respondents.length > 0 && (
          <div className="alarm-ack-section">
            <div className="alarm-ack-row">
              <span className="alarm-ack-label">Reagiert</span>
              <div className="alarm-ack-chips">
                {respondents.map(user => {
                  const acked = alarm.acknowledgedBy.includes(user)
                  return (
                    <span
                      key={user}
                      className={`ack-chip ${acked ? "ack-chip--confirmed" : "ack-chip--pending"}`}
                    >
                      {acked ? Icons.checkCircle : Icons.clock2}
                      {user}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
