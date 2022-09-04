import { FC, useContext, useEffect, useState } from "react"
import { Actions } from "./components/Actions"
import { SegmentTimer } from "./components/SegmentTimer"
import { Timer } from "./components/Timer"
import { SegmentsContext } from "./contexts/segments"
import { useTimer } from "./hooks/useTimer"
import { notEmpty } from "./utils/segments"
import { formatTimestamp } from "./utils/time"

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
  const topHeight = 25

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
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: `${topHeight}vh`,
          overflowY: "visible",
          background: "#ff1a44",
          padding: "0 24px 28px",
        }}
      >
        <span
          style={{
            textTransform: "uppercase",
            fontWeight: 700,
            letterSpacing: -0.35,
            fontSize: 22,
            color: "#ffffff",
            marginTop: 8,
          }}
        >
          {"Daily commute"}
        </span>
        <span
          style={{
            fontWeight: 500,
            fontSize: 16,
            color: "#FFA7B8",
            marginTop: 4,
          }}
        >
          {"Average time"}
          <span
            style={{
              fontWeight: 600,
              color: "#ffffff",
              marginLeft: 6,
            }}
          >
            {formatTimestamp(stack.average).split(".")[0]}
          </span>
        </span>
        <span
          style={{
            fontWeight: 500,
            fontSize: 14,
            color: "#FFA7B8",
            marginTop: 4,
          }}
          onClick={() => fullResetStack()}
        >
          {"Reset stats"}
        </span>
        <div
          style={{
            background: "#ffffff",
            position: "absolute",
            height: 30,
            zIndex: 2,
            bottom: -2, // Help seal edge with some overlap.
            left: -1,
            right: -1,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            boxShadow: "0px -8px 6px 0px #0d0d0d10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#f6f8fa",
              height: 4,
              width: 40,
              borderRadius: 20,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          // justifyContent: "flex-end",
          justifyContent: "space-between",
          height: `${100 - topHeight}vh`,
          overflow: "hidden",
          paddingBottom: 30,
        }}
      >
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
                  boxShadow: "0px -5px 6px 0px #e7e7e736",
                  paddingTop: 12,
                }
              : undefined
          }
        >
          <Timer time={time} />
          <Actions />
        </div>
      </div>
    </div>
  )
}
