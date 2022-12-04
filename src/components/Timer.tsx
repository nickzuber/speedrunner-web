import { FC, useContext } from "react"
import { SegmentsContext } from "../contexts/segments"
import {
  getCompletedStackTime,
  getTheoreticalBestTime,
  isCompletedSegmentStack,
  isRunningSegmentStack,
} from "../utils/segments"
import { formatTimestamp, parseTimestamp } from "../utils/time"
import { Badge, BadgeColors, BadgeIcons } from "./Badge"

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

  const ts = firstSegment ? Math.max(time - firstSegment.start, 0) : 0
  const formattedTs = formatTimestamp(ts)
  const [mins, ms] = formattedTs.split(".")

  const numDigits = mins.split("").filter((char) => !isNaN(+char)).length
  const numColons = mins.length - numDigits

  return (
    <div
      style={{
        position: "relative",
        fontSize: 28,
        fontWeight: 500,
        padding: "16px 24px",
        margin: "0px 0px 4px",
        gap: 18,
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
      <LargeTimer ts={ts} />
      <div
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 56,
          width: "42%",
          opacity: 0.5,
        }}
      >
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "18px",
            color: "#ffffff77",
          }}
        >
          <Badge
            time={stack.pb}
            color={BadgeColors.Default}
            icon={BadgeIcons.Crown}
          />
        </span>
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "18px",
            color: "#ffffff77",
          }}
        >
          <Badge
            time={getTheoreticalBestTime(stack)}
            color={BadgeColors.Default}
            icon={BadgeIcons.Zap}
          />
        </span>
      </div>
    </div>
  )
}

function NumberDisplay({ num }: { num: number }) {
  const twoDigitNum = num % 100
  const showLeadingZero = twoDigitNum < 10
  const isNumZero = num === 0

  const d1 = `${twoDigitNum}`.split("")[0]
  const d2 = `${twoDigitNum}`.split("")[1]

  return (
    <div
      className="timer-number-container"
      style={{
        flex: "0 0 50px",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      {isNumZero ? (
        <>
          <span style={{ opacity: 0.5 }}>{"0"}</span>
          <span style={{ opacity: 0.5 }}>{"0"}</span>
        </>
      ) : showLeadingZero ? (
        <>
          <span style={{ opacity: 0.5 }}>{"0"}</span>
          <span>{d1}</span>
        </>
      ) : (
        <>
          <span>{d1}</span>
          <span>{d2}</span>
        </>
      )}
    </div>
  )
}

function LargeTimer({ ts }: { ts: number }) {
  const { hours, minutes, seconds, ms } = parseTimestamp(ts)
  console.info({ hours, minutes, seconds, ms })

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <NumberDisplay num={hours} />
      <span style={{ flex: "0 0 25px", textAlign: "center" }}>{":"}</span>
      <NumberDisplay num={minutes} />
      <span style={{ flex: "0 0 25px", textAlign: "center" }}>{":"}</span>
      <NumberDisplay num={seconds} />
      <span
        style={{
          flex: "1 0 30px",
          marginTop: 6,
          textAlign: "left",
          fontSize: "60%",
          opacity: 0.5,
        }}
      >{`.${ms}`}</span>
    </div>
  )
}

function TimerIcon() {
  return (
    <svg
      style={{
        transform: "scale(0.8)",
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
