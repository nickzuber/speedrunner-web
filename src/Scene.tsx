import { FC, useContext, useEffect, useRef, useState } from "react"
import { SegmentsContext } from "./contexts/segments"
import { useTimer } from "./hooks/useTimer"
import { isNotStartedSegmentStack } from "./utils/segments"
import { formatTimestamp } from "./utils/time"

const Debug: FC = () => {
  const { stack } = useContext(SegmentsContext)
  return <pre>{JSON.stringify(stack, null, 2)}</pre>
}

const FinalTime: FC<{ time: number }> = ({ time }) => {
  const { stack } = useContext(SegmentsContext)
  const runningSegment = stack.running
  const firstCompletedSegment = stack.completed[0] || runningSegment
  return (
    <span style={{ fontFamily: "monospace" }}>
      {"Total "}
      {formatTimestamp(time - firstCompletedSegment.start)}
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

  if (!runningSegment) return null

  return (
    <div>
      {"running segment"}
      <br />
      <span style={{ fontSize: 24, fontWeight: 500, marginRight: 12 }}>
        {runningSegment.name}
        <br />
        <span
          style={{
            opacity: 0.75,
            fontSize: 14,
            marginLeft: 4,
            fontFamily: "monospace",
          }}
        >
          {`${stack.completed.length + 1}/${
            stack.queued.length + stack.completed.length + 1
          }`}
        </span>
      </span>
      <span>{formatTimestamp(time - runningSegment.start)}</span>
      <br />
      <FinalTime time={time} />
    </div>
  )
}

export const Scene: FC = () => {
  const { stack, advanceStack, fullResetStack, resetStack } =
    useContext(SegmentsContext)

  return (
    <div
      style={{
        display: "block",
      }}
    >
      <button
        style={{
          width: "100%",
          height: 200,
          margin: "12px auto",
        }}
        onClick={advanceStack}
      >
        complete segment
      </button>
      <button onClick={resetStack}>reset</button>
      <button onClick={fullResetStack}>full reset</button>
      <Timer />

      {isNotStartedSegmentStack(stack) ? (
        <div>
          <h4 style={{ marginBottom: 4 }}>{"Personal best"}</h4>
          {formatTimestamp(
            stack.queued.reduce(
              (total, segment) => (total += segment.pb || 0),
              0
            )
          )}
        </div>
      ) : null}

      {/* <Debug /> */}
    </div>
  )
}
