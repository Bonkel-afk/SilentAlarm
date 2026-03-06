export interface User {
  id: string
  name: string
  role: "admin" | "vet" | "assistant"
  roomId: string
}