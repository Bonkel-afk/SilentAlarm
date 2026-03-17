import { createContext, useContext } from "react"

export interface Session {
  username: string
  roomId: string
}

export const SessionContext = createContext<Session | null>(null)

export function useSession(): Session {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession must be used within SessionContext.Provider")
  return ctx
}
