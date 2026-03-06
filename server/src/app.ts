import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors" // ⚡

import type { ClientToServerEvents, ServerToClientEvents } from "../../shared/types/socket"
import type { Alarm } from "../../shared/types/alarm"

const app = express()
app.use(cors()) // ← CORS für alle Ursprünge erlaubt

const server = http.createServer(app)

// ⚡ Socket.IO Server mit CORS Option
const io = new Server<ClientToServerEvents,ServerToClientEvents >(server, {
  cors: {
    origin: "http://localhost:5173", // oder "*" für alle
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  socket.on("alarm:create", (data) => {
    const alarm: Alarm = {
      id: Date.now().toString(),
      ...data,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    }
    io.emit("alarm:new", alarm)
  })
})

server.listen(3000, () => console.log("Server running on port 3000"))