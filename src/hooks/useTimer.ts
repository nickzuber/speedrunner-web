import { useEffect, useRef, useState } from "react"
import { PersistedState } from "../constants/persisted"
import { createState } from "../utils/persisted"

const useTimerState = createState<number>(PersistedState.Timer)

export const useTimer = (isRunning: boolean) => {
  const timerRef = useRef<NodeJS.Timer | undefined>()
  const [time, setTime] = useTimerState(Date.now())

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTime(Date.now()), 10)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning])

  return time
}
