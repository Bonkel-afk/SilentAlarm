let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function beep(context: AudioContext, startTime: number, frequency: number, duration: number, volume: number) {
  const osc = context.createOscillator()
  const gain = context.createGain()

  osc.connect(gain)
  gain.connect(context.destination)

  osc.type = "square"
  osc.frequency.setValueAtTime(frequency, startTime)

  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01)
  gain.gain.setValueAtTime(volume, startTime + duration - 0.01)
  gain.gain.linearRampToValueAtTime(0, startTime + duration)

  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function playAlarmSound() {
  const context = getCtx()
  // Resume falls durch Browser-Autoplay-Policy gesperrt
  if (context.state === "suspended") context.resume()

  const now = context.currentTime
  const pattern = [
    { freq: 880, dur: 0.12 },
    { freq: 0,   dur: 0.04 },
    { freq: 880, dur: 0.12 },
    { freq: 0,   dur: 0.04 },
    { freq: 1100, dur: 0.25 },
    { freq: 0,   dur: 0.15 },
  ]

  // 3 Wiederholungen des Musters
  for (let rep = 0; rep < 3; rep++) {
    let t = now
    // Zeitoffset für vorherige Wiederholungen berechnen
    for (let r = 0; r < rep; r++) {
      for (const step of pattern) t += step.dur
    }
    for (const step of pattern) {
      if (step.freq > 0) beep(context, t, step.freq, step.dur, 0.35)
      t += step.dur
    }
  }
}
