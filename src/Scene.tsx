import { FC, useContext, useEffect, useRef, useState } from "react"
import { SegmentsContext } from "./contexts/segments"
import { useTimer } from "./hooks/useTimer"
import {
  isCompletedSegment,
  isFinishedSegmentStack,
  isInProgressSegmentStack,
  isNotStartedSegmentStack,
  isQueuedSegment,
  isRunningSegment,
  notEmpty,
} from "./utils/segments"
import { formatTimestamp } from "./utils/time"

const Debug: FC = () => {
  const { stack } = useContext(SegmentsContext)
  return <pre>{JSON.stringify(stack, null, 2)}</pre>
}

const FinalTime: FC<{ time: number }> = ({ time }) => {
  const { stack } = useContext(SegmentsContext)
  const firstSegment = isInProgressSegmentStack(stack)
    ? stack.running
    : isFinishedSegmentStack(stack)
    ? stack.completed[0]
    : null
  return (
    <span style={{ fontFamily: "monospace" }}>
      {"Total "}
      {firstSegment ? formatTimestamp(time - firstSegment.start) : "-"}
    </span>
  )
}

const Timer: FC = () => {
  const { stack } = useContext(SegmentsContext)

  const runningSegment = stack.running
  const isRunning = Boolean(runningSegment)
  const time = useTimer(isRunning)
  const segments = [...stack.completed, stack.running, ...stack.queued].filter(
    notEmpty
  )

  return (
    <div>
      {segments.map((segment) =>
        isRunningSegment(segment) ? (
          <div key={segment.id}>
            <span
              style={{
                fontSize: 14,
                marginRight: 8,
                display: "inline-block",
                color: "green",
                width: 170,
              }}
            >
              {segment.name}
            </span>
            <span style={{ fontFamily: "monospace" }}>
              {formatTimestamp(time - segment.start)}
            </span>
            <span
              style={{ fontFamily: "monospace", opacity: 0.5, marginLeft: 12 }}
            >
              {segment.pb ? formatTimestamp(segment.pb) : "-"}
            </span>
          </div>
        ) : isCompletedSegment(segment) ? (
          <div key={segment.id}>
            <span
              style={{
                fontSize: 14,
                marginRight: 8,
                display: "inline-block",
                width: 170,
                opacity: 0.5,
              }}
            >
              {segment.name}
            </span>
            <span style={{ fontFamily: "monospace" }}>
              {formatTimestamp(segment.end - segment.start)}
            </span>
            <span
              style={{ fontFamily: "monospace", opacity: 0.5, marginLeft: 12 }}
            >
              {segment.pb ? formatTimestamp(segment.pb) : "-"}
            </span>
          </div>
        ) : isQueuedSegment(segment) ? (
          <div key={segment.id}>
            <span
              style={{
                fontSize: 14,
                marginRight: 8,
                display: "inline-block",
                width: 170,
              }}
            >
              {segment.name}
            </span>
            <span style={{ fontFamily: "monospace" }}>{"-"}</span>
            <span
              style={{ fontFamily: "monospace", opacity: 0.5, marginLeft: 12 }}
            >
              {segment.pb ? formatTimestamp(segment.pb) : "-"}
            </span>
          </div>
        ) : null
      )}
      <FinalTime time={time} />
    </div>
  )

  // if (isNotStarted) {
  //   return <div>{"Not running"}</div>
  // } else if (isCompleted) {
  //   return (
  //     <div>
  //       {"complete"}
  //       <br />
  //       <FinalTime time={time} />
  //     </div>
  //   )
  // }

  // if (!runningSegment) return null

  // return (
  //   <div>
  //     {"running segment"}
  //     <br />
  //     <span style={{ fontSize: 24, fontWeight: 500, marginRight: 12 }}>
  //       {runningSegment.name}
  //       <br />
  //       <span
  //         style={{
  //           opacity: 0.75,
  //           fontSize: 14,
  //           marginLeft: 4,
  //           fontFamily: "monospace",
  //         }}
  //       >
  //         {`${stack.completed.length + 1}/${
  //           stack.queued.length + stack.completed.length + 1
  //         }`}
  //       </span>
  //     </span>
  //     <span>{formatTimestamp(time - runningSegment.start)}</span>
  //     <br />
  //     <FinalTime time={time} />
  //   </div>
  // )
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
