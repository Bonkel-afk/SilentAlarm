import type { Alarm } from "./alarm"

export interface ServerToClientEvents {
  "alarm:new": (alarm: Alarm) => void
  "alarm:update": (alarm: Alarm) => void
}

export interface ClientToServerEvents {
  "alarm:create": (data: {
    typeId: string
    userId: string
    roomId: string
  }) => void

  "alarm:ack": (alarmId: string) => void
}
