import AlarmButton from "./components/AlarmButton"
import { AlarmList } from "./components/AlarmList"

function App() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Silent Alarm System</h1>

      <AlarmButton/>

      <AlarmList />
    </div>
  )
}

export default App