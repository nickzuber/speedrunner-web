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
      {/* ====== */}
      <div
        style={{
          backdropFilter: "blur(1px) contrast(70%)",
          WebkitBackdropFilter: "blur(1px) contrast(70%)",
          height: 22,
          width: 65,
          borderRadius: 6,
          position: "absolute",
          zIndex: 999,
          top: 16,
          left: 10,
        }}
      />
      <div
        style={{
          backdropFilter: "blur(1px) contrast(70%)",
          WebkitBackdropFilter: "blur(1px) contrast(70%)",
          height: 22,
          width: 74,
          borderRadius: 6,
          position: "absolute",
          zIndex: 999,
          top: 16,
          right: 8,
        }}
      />
      {/* ====== */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: `${topHeight}vh`,
          overflowY: "visible",
          padding: "0 24px 28px",
          backgroundColor: "#ffffff",
          background: "url(map.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            backdropFilter: "blur(1px) contrast(50%)",
            WebkitBackdropFilter: "blur(1px) contrast(50%)",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: "3px",
            width: 175,
            marginTop: 50,
          }}
        >
          <span
            style={{
              fontWeight: 500,
              fontSize: 16,
              color: "#ffffffdd",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {"Average"}
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
              fontSize: 16,
              marginTop: 4,
              color: "#ffffffdd",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {"Pace"}
            <span
              style={{
                fontWeight: 600,
                color: "#ffffff",
                marginLeft: 6,
              }}
            >
              {isRunningSegmentStack(stack)
                ? formatTimestamp(getEstimatedPace(stack)).split(".")[0]
                : isCompletedSegmentStack(stack)
                ? formatTimestamp(getCompletedStackTime(stack))
                : "—"}
            </span>
          </span>
          <span
            style={{
              fontWeight: 500,
              fontSize: 16,
              marginTop: 4,
              color: "#ffffffdd",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {"Arrival"}
            <span
              style={{
                fontWeight: 600,
                color: "#ffffff",
                marginLeft: 6,
              }}
            >
              {isRunningSegmentStack(stack)
                ? formatDateMs(Date.now() + getEstimatedTimeLeft(stack))
                : isCompletedSegmentStack(stack)
                ? formatDateMs(stack.completed[stack.completed.length - 1].end)
                : formatDateMs(Date.now() + stack.average)}
            </span>
          </span>
        </div>
        {/* <span
          style={{
            fontWeight: 500,
            fontSize: 14,
            color: "#ffffffdd",
            backdropFilter: "blur(1px) contrast(50%)",
            WebkitBackdropFilter: "blur(1px) contrast(50%)",
            padding: "4px 12px",
            borderRadius: 4,
            marginTop: 4,
          }}
          onClick={() => fullResetStack()}
        >
          {"Reset stats"}
        </span> */}
        <div
          style={{
            background: "#ffffff",
            position: "absolute",
            height: 15,
            zIndex: 2,
            bottom: -2, // Help seal edge with some overlap.
            left: 0,
            right: 0,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            boxShadow: "0px -8px 6px 0px #0d0d0d10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></div>
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
                  background: "#f6f8fa",
                  paddingBottom: 36,
                }
              : {
                  background: "#f6f8fa",
                  paddingBottom: 36,
                }
          }
        >
          <Timer time={time} />
          <Actions />
        </div>
      </div>
    </div>
  )
}
