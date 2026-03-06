export type AlarmStatus =
  | "ACTIVE"
  | "ACKNOWLEDGED"
  | "CLOSED"

export interface Alarm {
  id: string
  typeId: string
  userId: string
  roomId: string
  status: AlarmStatus
  createdAt: string
  acknowledgedBy?: string
}