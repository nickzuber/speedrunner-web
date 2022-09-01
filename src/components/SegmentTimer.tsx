import { FC, useContext } from "react"
import { SegmentsContext } from "../contexts/segments"
import { useTimer } from "../hooks/useTimer"
import {
  CompletedSegment,
  QueuedSegment,
  RunningSegment,
  Segment,
} from "../types/segments"
import {
  getSegmentSplit,
  getTheoreticalBestTime,
  isCompletedSegment,
  isCompletedSegmentStack,
  isQueuedSegment,
  isRunningSegment,
  isRunningSegmentStack,
} from "../utils/segments"
import { formatTimestamp } from "../utils/time"
import { Badge, BadgeColors, BadgeIcons } from "./Badge"

export interface SegmentTimerProps {
  segment: Segment
  time: number // current active timer time
}

export const SegmentTimer: FC<SegmentTimerProps> = ({ segment, time }) => {
  if (isRunningSegment(segment)) {
    return <RunningSegmentTimer segment={segment} time={time} />
  } else if (isQueuedSegment(segment)) {
    return <QueuedSegmentTimer segment={segment} />
  } else if (isCompletedSegment(segment)) {
    return <CompletedSegmentTimer segment={segment} />
  }

  return null
}

const RunningSegmentTimer: FC<{ segment: RunningSegment; time: number }> = ({
  segment,
  time,
}) => {
  const split = time - segment.start
  const formattedTs = formatTimestamp(split)
  const [mins, ms] = formattedTs.split(".")

  const numDigits = mins.split("").filter((char) => !isNaN(+char)).length
  const numColons = mins.length - numDigits

  return (
    <div
      style={{
        position: "relative",
        fontSize: 28,
        fontWeight: 500,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        background: "#E1E2E3",
        margin: "0 8px",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 18,
            lineHeight: "24px",
            fontWeight: 500,
          }}
        >
          {segment.name}
        </span>
        <span
          style={{
            display: "inline-block",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "18px",
            color: "#00000077",
          }}
        >
          {"Best split"}
          <Badge
            time={segment.pb}
            color={BadgeColors.Green}
            icon={BadgeIcons.Crown}
          />
        </span>
      </div>
      <div
        style={{ flex: 1, textAlign: "right", position: "absolute", right: 18 }}
      >
        <span
          style={{
            width: 18 * numDigits + 6 * numColons,
            display: "inline-block",
            textAlign: "left",
          }}
        >
          {mins}
        </span>
        <span
          style={{
            width: 28,
            display: "inline-block",
            textAlign: "left",
            fontSize: "60%",
            opacity: 0.75,
          }}
        >{`.${ms}`}</span>
      </div>
    </div>
  )
}

const QueuedSegmentTimer: FC<{ segment: QueuedSegment }> = ({ segment }) => {
  const [mins, ms] = ["--", "--"]

  const numDigits = 1.6 // jank, forced padding
  const numColons = 0
  return (
    <div
      style={{
        position: "relative",
        fontSize: 28,
        fontWeight: 500,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        margin: "0 8px",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 18,
            lineHeight: "24px",
            fontWeight: 500,
          }}
        >
          {segment.name}
        </span>
        <span
          style={{
            display: "inline-block",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "18px",
            color: "#00000077",
          }}
        >
          {"Best split"}
          <Badge
            time={segment.pb}
            color={BadgeColors.Green}
            icon={BadgeIcons.Crown}
          />
        </span>
      </div>
      <div
        style={{ flex: 1, textAlign: "right", position: "absolute", right: 18 }}
      >
        <span
          style={{
            width: 18 * numDigits + 6 * numColons,
            display: "inline-block",
            textAlign: "left",
          }}
        >
          {mins}
        </span>
        <span
          style={{
            width: 28,
            display: "inline-block",
            textAlign: "left",
            fontSize: "60%",
            opacity: 0.75,
          }}
        >{`.${ms}`}</span>
      </div>
    </div>
  )
}

const CompletedSegmentTimer: FC<{ segment: CompletedSegment }> = ({
  segment,
}) => {
  const formattedTs = formatTimestamp(getSegmentSplit(segment))
  const [mins, ms] = formattedTs.split(".")

  const numDigits = mins.split("").filter((char) => !isNaN(+char)).length
  const numColons = mins.length - numDigits
  return (
    <div
      style={{
        position: "relative",
        fontSize: 28,
        fontWeight: 500,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        margin: "0 8px",
        borderRadius: 8,
        opacity: 0.5,
      }}
    >
      <div
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 18,
            lineHeight: "24px",
            fontWeight: 500,
          }}
        >
          {segment.name}
        </span>
        <span
          style={{
            display: "inline-block",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "18px",
            color: "#00000077",
          }}
        >
          {"Best split"}
          <Badge
            time={segment.pb}
            color={BadgeColors.Green}
            icon={BadgeIcons.Crown}
          />
        </span>
      </div>
      <div
        style={{ flex: 1, textAlign: "right", position: "absolute", right: 18 }}
      >
        <span
          style={{
            width: 18 * numDigits + 6 * numColons,
            display: "inline-block",
            textAlign: "left",
          }}
        >
          {mins}
        </span>
        <span
          style={{
            width: 28,
            display: "inline-block",
            textAlign: "left",
            fontSize: "60%",
            opacity: 0.75,
          }}
        >{`.${ms}`}</span>
      </div>
    </div>
  )
}
