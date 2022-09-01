import { FC, useContext } from "react"
import { SegmentTimer } from "./components/SegmentTimer"
import { Timer } from "./components/Timer"
import { SegmentsContext } from "./contexts/segments"
import { useTimer } from "./hooks/useTimer"
import { isCompletedSegmentStack, notEmpty } from "./utils/segments"

const Segments: FC = () => {
  const { stack } = useContext(SegmentsContext)
  const isSomeSegmentRunning = Boolean(stack.running)
  const time = useTimer(isSomeSegmentRunning)

  const segments = [...stack.completed, stack.running, ...stack.queued].filter(
    notEmpty
  )

  return (
    <>
      {segments.map((segment) => (
        <SegmentTimer key={segment.id} time={time} segment={segment} />
      ))}
      <div
        style={{
          background: "#E1E2E3",
          height: 2,
          borderRadius: 2,
          margin: "10px 12px 4px",
        }}
      />
      <Timer time={time} />
    </>
  )
}

export const Scene: FC = () => {
  const { stack, advanceStack, fullResetStack, resetStack, saveSegments } =
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
      {isCompletedSegmentStack(stack) ? (
        <button onClick={saveSegments}>save pbs</button>
      ) : null}

      <Segments />
    </div>
  )
}
