import { FC, useContext } from "react"
import { SegmentsContext } from "../contexts/segments"
import {
  getCompletedStackTime,
  getEstimatedTimeLeft,
  getTheoreticalBestTime,
  isCompletedSegmentStack,
  isRunningSegmentStack,
} from "../utils/segments"
import { formatDateMs, formatTimestamp, parseTimestamp } from "../utils/time"
import { Badge, BadgeColors, BadgeIcons } from "./Badge"
import { TimeDisplay } from "./TimeDisplay"

export interface TimerProps {
  time: number
}

export const Timer: FC<TimerProps> = ({ time }) => {
  const { stack } = useContext(SegmentsContext)
  const firstSegment = isRunningSegmentStack(stack)
    ? stack.completed[0] || stack.running
    : isCompletedSegmentStack(stack)
    ? stack.completed[0]
    : null

  const runningSegment = stack.running

  const ts = firstSegment ? Math.max(time - firstSegment.start, 0) : 0
  const formattedTs = formatTimestamp(ts)
  const [mins, ms] = formattedTs.split(".")

  const numDigits = mins.split("").filter((char) => !isNaN(+char)).length
  const numColons = mins.length - numDigits

  const name = runningSegment?.name
  const desc = runningSegment?.desc

  return (
    <div
      style={{
        position: "relative",
        fontSize: 28,
        fontWeight: 500,
        padding: "16px 24px",
        margin: "0px 0px 4px",
        gap: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
        background: "transparent",
        borderTop: "1px solid transparent",
        borderBottom: "1px solid transparent",
      }}
    >
      <TimerIcon />
      <TimeDisplay
        dimMs
        ts={ts}
        className="timer-number-container"
        numberStyle={{
          flex: "0 0 50px",
        }}
        semiStyle={{
          marginTop: 12,
          flex: "0 0 25px",
        }}
        style={{
          fontSize: 32,
          fontWeight: 500,
          width: "100%",
          alignItems: "center",
          margin: "0px auto 12px",
        }}
      />
      <div
        style={{
          width: "90%",
          height: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {/* TODO(nickz) I don't think we need this anymore */}
        {false && name && desc ? (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: 18,
                display: "block",
                margin: "8px auto 16px",
              }}
            >
              {name}
            </span>
            <p
              style={{
                marginBlock: "auto",
                marginInline: "auto",
                padding: "0",
                fontSize: "14px",
                lineHeight: "19px",
                opacity: "0.5",
              }}
            >
              {desc}
            </p>
          </div>
        ) : (
          <>
            <span
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 400,
                lineHeight: "18px",
                color: "#ffffffaa",
                opacity: 0.35,
                margin: "4px auto",
                width: "95%",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 17,
                  display: "block",
                }}
              >
                PB
              </span>
              <Badge
                size={1.1}
                style={{
                  fontWeight: 500,
                  position: "absolute",
                  top: -4,
                  justifyContent: "flex-end",
                  right: 0,
                }}
                time={stack.pb}
                color={BadgeColors.Default}
                icon={BadgeIcons.Crown}
              />
            </span>
            {/* <span
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 400,
                lineHeight: "18px",
                color: "#ffffffaa",
                opacity: 0.35,
                margin: "4px auto",
                width: "95%",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 17,
                  display: "block",
                }}
              >
                TPB
              </span>
              <Badge
                size={1.1}
                style={{
                  fontWeight: 500,
                  position: "absolute",
                  top: -4,
                  justifyContent: "flex-end",
                  right: 0,
                }}
                time={getTheoreticalBestTime(stack)}
                color={BadgeColors.Default}
                icon={BadgeIcons.Zap}
              />
            </span> */}
            <span
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 400,
                lineHeight: "18px",
                color: "#ffffffaa",
                opacity: 0.35,
                margin: "4px auto",
                width: "95%",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 17,
                  display: "block",
                }}
              >
                AVG
              </span>
              <Badge
                size={1.1}
                style={{
                  fontWeight: 500,
                  position: "absolute",
                  top: -4,
                  justifyContent: "flex-end",
                  right: 0,
                }}
                time={formatTimestamp(stack.average).split(".")[0]}
                color={BadgeColors.Default}
                icon={BadgeIcons.Zap}
              />
            </span>
            <span
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 400,
                lineHeight: "18px",
                color: "#ffffffaa",
                margin: "4px auto",
                width: "95%",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 17,
                  display: "block",
                }}
              >
                ETA
              </span>
              <Badge
                size={1.1}
                style={{
                  fontWeight: 500,
                  position: "absolute",
                  top: -4,
                  right: 0,
                  justifyContent: "flex-end",
                  color: "white",
                }}
                time={
                  isRunningSegmentStack(stack)
                    ? formatDateMs(Date.now() + getEstimatedTimeLeft(stack))
                    : isCompletedSegmentStack(stack)
                    ? formatDateMs(
                        stack.completed[stack.completed.length - 1].end
                      )
                    : formatDateMs(Date.now() + stack.average)
                }
                width={100}
                color={BadgeColors.Default}
              />
            </span>
          </>
        )}
      </div>
    </div>
  )
}

function TimerIcon() {
  return <span style={{ fontSize: 80 }}>👟</span>

  return (
    <svg
      style={{
        transform: "scale(0.9)",
      }}
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="44" cy="44" r="44" fill="white" />
      <circle cx="44" cy="44" r="20" fill="#FF1A44" />
      <line
        x1="44"
        y1="35"
        x2="44"
        y2="45"
        stroke="white"
        stroke-width="6"
        stroke-linecap="round"
      />
      <line
        x1="44"
        y1="35"
        x2="44"
        y2="45"
        stroke="white"
        stroke-width="6"
        stroke-linecap="round"
      />
      <line
        x1="49.9298"
        y1="48.1971"
        x2="44.1972"
        y2="45.0702"
        stroke="white"
        stroke-width="6"
        stroke-linecap="round"
      />
      <line
        x1="49.9298"
        y1="48.1971"
        x2="44.1972"
        y2="45.0702"
        stroke="white"
        stroke-width="6"
        stroke-linecap="round"
      />
    </svg>
  )
}
