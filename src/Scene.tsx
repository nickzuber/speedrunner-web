import { FC, useContext, useEffect, useRef, useState } from "react"
import { SegmentsContext } from "./contexts/segments"
import { useTimer } from "./hooks/useTimer"

const Debug: FC = () => {
  const { stack } = useContext(SegmentsContext)
  return <pre>{JSON.stringify(stack, null, 2)}</pre>
}

const FinalTime: FC<{ time: number }> = ({ time }) => {
  const { stack } = useContext(SegmentsContext)
  const runningSegment = stack.running
  const firstCompletedSegment = stack.completed[0] || runningSegment
  return (
    <span>
      {"Total "}
      {(time - firstCompletedSegment.start) / 1000}
    </span>
  )
}

const Timer: FC = () => {
  const { stack } = useContext(SegmentsContext)

  const runningSegment = stack.running

  const isRunning = Boolean(runningSegment)
  const isCompleted = !isRunning && stack.completed.length > 0
  const isNotStarted = !isRunning && stack.completed.length === 0

  const time = useTimer(isRunning)

  if (isNotStarted) {
    return <div>{"Not running"}</div>
  } else if (isCompleted) {
    return (
      <div>
        {"complete"}
        <br />
        <FinalTime time={time} />
      </div>
    )
  }

  if (!runningSegment || !time) return null

  return (
    <div>
      {"running"}
      <br />
      <span>
        {"Segment "}
        {(time - runningSegment.start) / 1000}
      </span>
      <br />
      <FinalTime time={time} />
    </div>
  )
}

export const Scene: FC<{}> = () => {
  const { advanceStack, resetStack } = useContext(SegmentsContext)

  return (
    <>
      <button onClick={advanceStack}>complete segment</button>
      <button onClick={resetStack}>reset</button>
      <Timer />
      <Debug />
    </>
  )
}
