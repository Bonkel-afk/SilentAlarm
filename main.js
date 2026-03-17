const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")

const isDev = process.env.NODE_ENV === "development"

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (isDev) {
    win.loadURL("http://localhost:5173")
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, "client/dist/index.html"))
  }

  ipcMain.on("alarm:trigger", () => {
    if (win.isMinimized()) win.restore()
    win.setAlwaysOnTop(true)
    win.show()
    win.focus()
    win.flashFrame(true)
    setTimeout(() => {
      win.setAlwaysOnTop(false)
      win.flashFrame(false)
    }, 5000)
  })
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
