import { CSSProperties, FC, useContext } from "react"
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
import {
  formatTimestamp,
  getBadgeSplitColor,
  getBadgeSplitIcon,
  getBadgeSplitWidth,
} from "../utils/time"
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

const styles: Record<string, CSSProperties> = {
  container: {
    position: "relative",
    fontSize: 28,
    fontWeight: 500,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    margin: "4px 8px",
    borderRadius: 8,
  },
  left: {
    flex: 1.5,
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
  },
  right: { flex: 1, textAlign: "right", position: "absolute", right: 18 },
  name: {
    display: "block",
    fontSize: 18,
    lineHeight: "20px",
    fontWeight: 500,
    width: "50%",
    marginBottom: 4,
  },
  byline: {
    display: "inline-block",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "18px",
    color: "#00000077",
  },
  minutes: {
    display: "inline-block",
    textAlign: "left",
  },
  milliseconds: {
    width: 28,
    display: "inline-block",
    textAlign: "left",
    fontSize: "60%",
    opacity: 0.75,
  },
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

  const diffTs = shouldShowPbTimerBadge(segment, split)

  return (
    <div style={{ ...styles.container, background: "#f6f8fa" }}>
      <div style={styles.left}>
        <span style={styles.name}>{segment.name}</span>
        <span style={styles.byline}>
          {"Best split"}
          <Badge
            time={segment.pb}
            color={BadgeColors.Green}
            icon={BadgeIcons.Crown}
          />
        </span>
      </div>
      <div style={styles.right}>
        {diffTs ? (
          <Badge
            color={getBadgeSplitColor(diffTs)}
            icon={getBadgeSplitIcon(diffTs)}
            time={Math.abs(diffTs)}
            width={getBadgeSplitWidth(diffTs, true)}
            style={{ marginRight: 8 }}
            size={1}
          />
        ) : null}
        <span
          style={{ ...styles.minutes, width: 18 * numDigits + 6 * numColons }}
        >
          {mins}
        </span>
        <span style={styles.milliseconds}>{`.${ms}`}</span>
      </div>
    </div>
  )
}

const QueuedSegmentTimer: FC<{ segment: QueuedSegment }> = ({ segment }) => {
  const [mins, ms] = ["--", "--"]

  const numDigits = 1.6 // jank, forced padding
  const numColons = 0
  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <span style={styles.name}>{segment.name}</span>
        <span style={styles.byline}>
          {"Best split"}
          <Badge
            time={segment.pb}
            color={BadgeColors.Green}
            icon={BadgeIcons.Crown}
          />
        </span>
      </div>
      <div style={styles.right}>
        <span
          style={{ ...styles.minutes, width: 18 * numDigits + 6 * numColons }}
        >
          {mins}
        </span>
        <span style={styles.milliseconds}>{`.${ms}`}</span>
      </div>
    </div>
  )
}

const CompletedSegmentTimer: FC<{ segment: CompletedSegment }> = ({
  segment,
}) => {
  const split = segment.end - segment.start
  const formattedTs = formatTimestamp(getSegmentSplit(segment))
  const [mins, ms] = formattedTs.split(".")

  const numDigits = mins.split("").filter((char) => !isNaN(+char)).length
  const numColons = mins.length - numDigits
  const diffTs = segment.pb ? split - segment.pb : null

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <span style={styles.name}>{segment.name}</span>
        <span style={styles.byline}>
          {"Best split"}
          <Badge
            time={segment.pb ? Math.min(segment.pb, split) : split}
            color={BadgeColors.Green}
            icon={BadgeIcons.Crown}
          />
        </span>
      </div>
      <div style={styles.right}>
        {diffTs ? (
          <Badge
            color={getBadgeSplitColor(diffTs)}
            icon={getBadgeSplitIcon(diffTs)}
            time={Math.abs(diffTs)}
            width={getBadgeSplitWidth(diffTs, false)}
            style={{ marginRight: 8 }}
            size={1}
          />
        ) : null}
        <span
          style={{ ...styles.minutes, width: 18 * numDigits + 6 * numColons }}
        >
          {mins}
        </span>
        <span style={styles.milliseconds}>{`.${ms}`}</span>
      </div>
    </div>
  )
}

function shouldShowPbTimerBadge(segment: RunningSegment, split: number) {
  if (!segment.pb) {
    return false
  }

  const ts = split - segment.pb

  // <= 1:30
  if (ts >= -1000 * 90) {
    return ts
  }

  return false
}
