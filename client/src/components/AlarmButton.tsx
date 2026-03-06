import { socket } from "../socket"

export default function AlarmButton() {

  const sendAlarm = () => {

    socket.emit("alarm:create", {
      typeId: "help",
      userId: "lisa",
      roomId: "room2"
    })

  }

  return (
    <button onClick={sendAlarm}>
      Hilfe Alarm
    </button>
  )
}