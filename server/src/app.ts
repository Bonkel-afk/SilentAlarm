import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"

import type { ClientToServerEvents, ServerToClientEvents } from "../../shared/types/socket"
import type { Alarm } from "../../shared/types/alarm"

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// In-memory stores
const alarms = new Map<string, Alarm>()
const connectedUsers = new Map<string, string>() // socketId -> username

function broadcastUserList() {
  io.emit("user:list", Array.from(connectedUsers.values()))
}

io.on("connection", (socket) => {
  socket.on("user:join", (username) => {
    connectedUsers.set(socket.id, username)
    broadcastUserList()
    // Send all current alarms to the joining client
    socket.emit("alarm:sync", Array.from(alarms.values()))
  })

  socket.on("alarm:create", (data) => {
    const alarm: Alarm = {
      id: Date.now().toString(),
      ...data,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      acknowledgedBy: [],
    }
    alarms.set(alarm.id, alarm)
    io.emit("alarm:new", alarm)
  })

  socket.on("alarm:ack", (alarmId) => {
    const alarm = alarms.get(alarmId)
    const username = connectedUsers.get(socket.id)
    if (!alarm || !username) return
    if (alarm.acknowledgedBy.includes(username)) return

    alarm.acknowledgedBy.push(username)
    if (alarm.status === "ACTIVE") {
      alarm.status = "ACKNOWLEDGED"
    }

    io.emit("alarm:update", alarm)
  })

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id)
    broadcastUserList()
  })
})

server.listen(3000, () => console.log("Server running on port 3000"))
