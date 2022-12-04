import { CSSProperties } from "react"
import { parseTimestamp } from "../utils/time"

interface TimeDisplayProps {
  ts: number
  noHours?: boolean
  style?: CSSProperties
  numberStyle?: CSSProperties
  semiStyle?: CSSProperties
  className?: string // "timer-number-container-segment"
}

export function TimeDisplay({
  ts,
  noHours,
  style,
  numberStyle,
  semiStyle,
  className,
}: TimeDisplayProps) {
  const { hours, minutes, seconds, ms } = parseTimestamp(ts)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Anek",
        ...style,
      }}
    >
      {!noHours ? (
        <>
          <NumberDisplay
            style={numberStyle}
            className={className}
            num={hours}
          />
          <Semicolon style={semiStyle} dim={hours === 0} />
        </>
      ) : null}
      <NumberDisplay
        style={numberStyle}
        className={className}
        num={minutes}
        dimLeadingZero={hours === 0}
        noDimZero={hours > 0}
      />
      <Semicolon style={semiStyle} dim={minutes === 0} />
      <NumberDisplay
        style={numberStyle}
        className={className}
        num={seconds}
        dimLeadingZero={minutes === 0}
        noDimZero={minutes > 0}
      />
      <Semicolon dim={ts === 0} style={semiStyle} />
      <NumberDisplay style={numberStyle} num={ms} className={className} />
    </div>
  )
}

export function NumberDisplay({
  num,
  dim,
  small,
  dimLeadingZero,
  noDimZero,
  style,
  className,
}: {
  num: number
  dim?: boolean
  small?: boolean
  dimLeadingZero?: boolean
  noDimZero?: boolean
  style?: CSSProperties
  className?: string
}) {
  const twoDigitNum = num % 100
  const showLeadingZero = twoDigitNum < 10
  const isNumZero = num === 0

  const dimOpacity = 0.25

  const d1 = `${twoDigitNum}`.split("")[0]
  const d2 = `${twoDigitNum}`.split("")[1]

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        ...style,
      }}
    >
      {isNumZero ? (
        <>
          <span style={{ opacity: noDimZero ? 1 : dimOpacity }}>{"0"}</span>
          <span style={{ opacity: noDimZero ? 1 : dimOpacity }}>{"0"}</span>
        </>
      ) : showLeadingZero ? (
        <>
          <span style={{ opacity: dimLeadingZero ? dimOpacity : 1 }}>
            {"0"}
          </span>
          <span style={{ opacity: small ? dimOpacity : 1 }}>{d1}</span>
        </>
      ) : (
        <>
          <span style={{ opacity: small ? dimOpacity : 1 }}>{d1}</span>
          <span style={{ opacity: small ? dimOpacity : 1 }}>{d2}</span>
        </>
      )}
    </div>
  )
}

export function Semicolon({
  dim,
  style,
}: {
  dim?: boolean
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        marginTop: -2,
        flex: "0 0 12px",
        textAlign: "center",
        opacity: dim ? 0.25 : 1,
        ...style,
      }}
    >
      {":"}
    </span>
  )
}
