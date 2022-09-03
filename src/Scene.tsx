import { FC, useContext } from "react"
import { Actions } from "./components/Actions"
import { SegmentTimer } from "./components/SegmentTimer"
import { Timer } from "./components/Timer"
import { SegmentsContext } from "./contexts/segments"
import { useTimer } from "./hooks/useTimer"
import { notEmpty } from "./utils/segments"

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
      <Timer time={time} />
    </>
  )
}

export const Scene: FC = () => {
  const { fullResetStack } = useContext(SegmentsContext)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "20vh",
          overflow: "hidden",
          background: "#f6f8fa77",
          borderBottom: "1px solid #ebeef177",
          padding: "0 24px",
        }}
      >
        <button className="action-idle-button" onClick={() => fullResetStack()}>
          {"Reset stats"}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "80vh",
          overflow: "hidden",
          paddingBottom: 38,
        }}
      >
        <Segments />
        <Actions />
      </div>
    </div>
  )
}
