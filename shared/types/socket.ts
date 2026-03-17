import type { Alarm } from "./alarm"

export interface ServerToClientEvents {
  "alarm:new": (alarm: Alarm) => void
  "alarm:update": (alarm: Alarm) => void
  "alarm:sync": (alarms: Alarm[]) => void
  "user:list": (usernames: string[]) => void
}

export interface ClientToServerEvents {
  "alarm:create": (data: {
    typeId: string
    userId: string
    roomId: string
    notes?: string
  }) => void
  "alarm:ack": (alarmId: string) => void
  "alarm:close": (alarmId: string) => void
  "user:join": (username: string) => void
}
