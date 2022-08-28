import { useEffect, useRef, useState } from "react"

export const useTimer = (isRunning: boolean) => {
  const timerRef = useRef<NodeJS.Timer | undefined>()
  const [time, setTime] = useState<number>(Date.now())

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTime(Date.now()), 10)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning])

  return time
}
