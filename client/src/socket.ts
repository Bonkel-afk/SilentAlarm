import { io, Socket } from "socket.io-client"
import type {
  ServerToClientEvents,
  ClientToServerEvents
} from "../../shared/types/socket"

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000"

export const socket: Socket<
  ServerToClientEvents,
  ClientToServerEvents
> = io(SERVER_URL)