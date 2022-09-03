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
  const topHeight = 30

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
        <svg
          width="104"
          height="104"
          viewBox="0 0 104 104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_25_286)">
            <circle cx="52" cy="50" r="44" fill="white" />
            <circle cx="52" cy="50" r="20" fill="#FF1A44" />
            <line
              x1="52"
              y1="41"
              x2="52"
              y2="51"
              stroke="white"
              stroke-width="6"
              stroke-linecap="round"
            />
            <line
              x1="52"
              y1="41"
              x2="52"
              y2="51"
              stroke="white"
              stroke-width="6"
              stroke-linecap="round"
            />
            <line
              x1="57.9298"
              y1="54.1971"
              x2="52.1972"
              y2="51.0702"
              stroke="white"
              stroke-width="6"
              stroke-linecap="round"
            />
            <line
              x1="57.9298"
              y1="54.1971"
              x2="52.1972"
              y2="51.0702"
              stroke="white"
              stroke-width="6"
              stroke-linecap="round"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_25_286"
              x="0"
              y="0"
              width="104"
              height="104"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.254167 0 0 0 0 0.254167 0 0 0 0 0.254167 0 0 0 0.17 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_25_286"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_25_286"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
        <span
          style={{
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: -0.25,
            fontSize: 20,
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
        <button onClick={() => fullResetStack()}>{"Reset stats"}</button>
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
          justifyContent: "flex-end",
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
                  marginTop: 18,
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
