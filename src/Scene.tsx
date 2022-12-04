import { FC, useContext, useEffect, useState } from "react"
import { Actions } from "./components/Actions"
import { SegmentTimer } from "./components/SegmentTimer"
import { Timer } from "./components/Timer"
import { SegmentsContext } from "./contexts/segments"
import { useTimer } from "./hooks/useTimer"
import {
  getCompletedStackTime,
  getEstimatedPace,
  getEstimatedTimeLeft,
  isCompletedSegmentStack,
  isRunningSegmentStack,
  notEmpty,
} from "./utils/segments"
import { formatDateMs, formatTimestamp } from "./utils/time"

const Segments: FC<{ time: number }> = ({ time }) => {
  const { stack } = useContext(SegmentsContext)

  const segments = [...stack.completed, stack.running, ...stack.queued].filter(
    notEmpty
  )

  return (
    <>
      {segments.map((segment, xid) => (
        <SegmentTimer
          key={segment.id}
          time={time}
          segment={segment}
          index={xid}
        />
      ))}
    </>
  )
}

export const Scene: FC = () => {
  const { stack, fullResetStack } = useContext(SegmentsContext)
  const [isScrollable, setIsScrollable] = useState(false)
  const isSomeSegmentRunning = Boolean(stack.running)
  const time = useTimer(isSomeSegmentRunning)

  // Avoid safair scrollable behavior if there's nothing to scroll.
  // TODO use refs to avoid layout calc before render
  useEffect(() => {
    const containerElem = document.querySelector(
      "#scrollable-segments"
    ) as HTMLDivElement | null
    if (containerElem) {
      const overflowHeight = containerElem.scrollHeight
      const realHeight = containerElem.offsetHeight
      if (overflowHeight > realHeight && !isScrollable) {
        setIsScrollable(true)
      } else if (overflowHeight <= realHeight && isScrollable) {
        setIsScrollable(false)
      }
    }
  }, [stack, isScrollable])

  // Measured in `vh`
  const topHeight = 33

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Timer time={time} />
      <div
        id="scrollable-segments"
        style={
          isScrollable
            ? {
                overflowX: "hidden",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }
            : {
                overflow: "hidden",
              }
        }
      >
        <Segments time={time} />
      </div>
      <div
        style={
          isScrollable
            ? {
                boxShadow: "0px -5px 6px 0px #9f000033",
                paddingTop: 12,
                background: "transparent",
                paddingBottom: 36,
              }
            : {
                background: "transparent",
                paddingBottom: 36,
              }
        }
      >
        <Actions />
      </div>
    </div>
  )
}
