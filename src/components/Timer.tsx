import { FC, useContext } from "react"
import { SegmentsContext } from "../contexts/segments"
import {
  getCompletedStackTime,
  getTheoreticalBestTime,
  isCompletedSegmentStack,
  isRunningSegmentStack,
} from "../utils/segments"
import { formatTimestamp } from "../utils/time"
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
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
        marginTop: 24,
        // marginTop: 12,
        // background: "#f6f8fa",
        // borderTop: "1px solid #ebeef1",
        // borderBottom: "1px solid #ebeef1",
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
          {"Total"}
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
          {"Personal best"}
          <Badge
            time={stack.pb}
            color={BadgeColors.Green}
            icon={BadgeIcons.Crown}
          />
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
          {"Theoretical best"}
          <Badge
            time={getTheoreticalBestTime(stack)}
            color={BadgeColors.Gold}
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
