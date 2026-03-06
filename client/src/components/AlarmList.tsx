import React, { useEffect, useState } from "react"
import { socket } from "../socket"
import type { Alarm } from "../../../shared/types/alarm"

export const AlarmList: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([])

  useEffect(() => {
    socket.on("alarm:new", (alarm) => {
      setAlarms(prev => [...prev, alarm])
    })

    return () => {
      socket.off("alarm:new")
    }
  }, [])

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Aktive Alarme</h2>
      {alarms.length === 0 && <p>Keine Alarme</p>}
      <ul>
        {alarms.map(a => (
          <li key={a.id}>
            {a.typeId} Alarm von {a.userId} im Raum {a.roomId} ({a.status})
          </li>
        ))}
      </ul>
    </div>
  )
}