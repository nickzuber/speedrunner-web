import { CSSProperties, FC, useContext, useEffect } from "react"
import { SegmentsContext } from "../contexts/segments"
import {
  CompletedSegment,
  QueuedSegment,
  RunningSegment,
  Segment,
} from "../types/segments"
import {
  getSegmentSplit,
  isCompletedSegment,
  isQueuedSegment,
  isRunningSegment,
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
  index: number
}

export const SegmentTimer: FC<SegmentTimerProps> = ({
  segment,
  time,
  index,
}) => {
  if (isRunningSegment(segment)) {
    return <RunningSegmentTimer index={index} segment={segment} time={time} />
  } else if (isQueuedSegment(segment)) {
    return <QueuedSegmentTimer index={index} segment={segment} />
  } else if (isCompletedSegment(segment)) {
    return <CompletedSegmentTimer index={index} segment={segment} />
  }

  return null
}

const styles: Record<string, CSSProperties> = {
  container: {
    position: "relative",
    fontSize: 28,
    fontWeight: 500,
    padding: "10px 18px",
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
    zIndex: 1,
  },
  right: {
    flex: 1,
    textAlign: "right",
    position: "absolute",
    right: 18,
    zIndex: 1,
  },
  name: {
    display: "block",
    fontSize: 16,
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
  bylineTextWrapper: {
    display: "inline-block",
    width: 65,
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

const RunningSegmentTimer: FC<{
  segment: RunningSegment
  time: number
  index: number
}> = ({ segment, time, index }) => {
  const { stack } = useContext(SegmentsContext)
  const split = time - segment.start
  const formattedTs = formatTimestamp(split)
  const [mins, ms] = formattedTs.split(".")

  const numDigits = mins.split("").filter((char) => !isNaN(+char)).length
  const numColons = mins.length - numDigits

  const diffTs = shouldShowPbTimerBadge(segment, split)

  useEffect(() => {
    const elem = document.querySelector(`#segment-${index}`)
    if (elem) {
      elem.scrollIntoView({
        behavior: "smooth",
      })
    }
  }, [])

  return (
    <div id={`segment-${index}`} style={styles.container}>
      <div
        className={
          stack.completed.length === 0
            ? "new-select-fadein"
            : "new-select-slidedown"
        }
      />
      <div style={styles.left}>
        <span style={styles.name}>{segment.name}</span>
        <span style={styles.byline}>
          <span style={styles.bylineTextWrapper}>{"Best split"}</span>
          <Badge
            time={segment.pb}
            color={BadgeColors.Default}
            icon={BadgeIcons.Crown}
          />
        </span>
      </div>
      <div style={styles.right} className="slide-in">
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

const QueuedSegmentTimer: FC<{ segment: QueuedSegment; index: number }> = ({
  segment,
  index,
}) => {
  return (
    <div id={`segment-${index}`} style={styles.container}>
      <div style={styles.left}>
        <span style={styles.name}>{segment.name}</span>
        <span style={styles.byline}>
          <span style={styles.bylineTextWrapper}>{"Best split"}</span>
          <Badge
            time={segment.pb}
            color={BadgeColors.Default}
            icon={BadgeIcons.Crown}
          />
        </span>
      </div>
      <div style={{ ...styles.right, color: "#f4f6f7" }}>
        <span style={{ ...styles.minutes, width: 30 }}>{"—"}</span>
      </div>
    </div>
  )
}

const CompletedSegmentTimer: FC<{ segment: CompletedSegment; index: number }> =
  ({ segment, index }) => {
    const split = segment.end - segment.start
    const formattedTs = formatTimestamp(getSegmentSplit(segment))
    const [mins, ms] = formattedTs.split(".")

    const numDigits = mins.split("").filter((char) => !isNaN(+char)).length
    const numColons = mins.length - numDigits
    const diffTs = segment.pb ? split - segment.pb : null

    return (
      <div id={`segment-${index}`} style={styles.container}>
        <div style={styles.left}>
          <span style={styles.name}>{segment.name}</span>
          <span style={styles.byline}>
            <span style={styles.bylineTextWrapper}>{"Best split"}</span>
            <Badge
              time={segment.pb ? Math.min(segment.pb, split) : split}
              color={BadgeColors.Default}
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
              fadeIn={diffTs <= -1000 * 90}
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
