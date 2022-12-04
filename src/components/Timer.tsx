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
          margin: "12px auto",
        }}
      />
      <div
        style={{
          width: "90%",
          height: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: name && desc ? "flex-start" : "center",
        }}
      >
        {name && desc ? (
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
                margin: "8px auto",
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
                Personal fastest time
              </span>
              <Badge
                size={1.1}
                style={{
                  fontWeight: 500,
                  position: "absolute",
                  top: -4,
                  right: 0,
                }}
                time={stack.pb}
                color={BadgeColors.Default}
                icon={BadgeIcons.Crown}
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
                opacity: 0.35,
                margin: "8px auto",
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
                Theoretical fastest time
              </span>
              <Badge
                size={1.1}
                style={{
                  fontWeight: 500,
                  position: "absolute",
                  top: -4,
                  right: 0,
                }}
                time={getTheoreticalBestTime(stack)}
                color={BadgeColors.Default}
                icon={BadgeIcons.Zap}
              />
            </span>
          </>
        )}
      </div>
    </div>
  )
}

// function NumberDisplay({
//   num,
//   small,
//   dimLeadingZero,
// }: {
//   num: number
//   small?: boolean
//   dimLeadingZero?: boolean
// }) {
//   const twoDigitNum = num % 100
//   const showLeadingZero = twoDigitNum < 10
//   const isNumZero = num === 0

//   const dim = 0.25

//   const d1 = `${twoDigitNum}`.split("")[0]
//   const d2 = `${twoDigitNum}`.split("")[1]

//   return (
//     <div
//       className="timer-number-container"
//       style={{
//         flex: "0 0 50px",
//         display: "flex",
//         justifyContent: "space-evenly",
//         alignItems: "center",
//       }}
//     >
//       {isNumZero ? (
//         <>
//           <span style={{ opacity: dim }}>{"0"}</span>
//           <span style={{ opacity: dim }}>{"0"}</span>
//         </>
//       ) : showLeadingZero ? (
//         <>
//           <span style={{ opacity: small || dimLeadingZero ? dim : 1 }}>
//             {"0"}
//           </span>
//           <span style={{ opacity: small ? dim : 1 }}>{d1}</span>
//         </>
//       ) : (
//         <>
//           <span style={{ opacity: small ? dim : 1 }}>{d1}</span>
//           <span style={{ opacity: small ? dim : 1 }}>{d2}</span>
//         </>
//       )}
//     </div>
//   )
// }

// function Semicolon({ dim }: { dim?: boolean }) {
//   return (
//     <span
//       style={{
//         marginTop: 12,
//         flex: "0 0 25px",
//         textAlign: "center",
//         opacity: dim ? 0.25 : 1,
//       }}
//     >
//       {":"}
//     </span>
//   )
// }

// function LargeTimer({ ts }: { ts: number }) {
//   const { hours, minutes, seconds, ms } = parseTimestamp(ts)

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         fontFamily: "Anek",
//         fontSize: 32,
//         fontWeight: 500,
//       }}
//     >
//       <NumberDisplay num={hours} />
//       <Semicolon dim={hours === 0} />
//       <NumberDisplay num={minutes} dimLeadingZero={hours === 0} />
//       <Semicolon dim={minutes === 0} />
//       <NumberDisplay num={seconds} dimLeadingZero={minutes === 0} />
//       <Semicolon dim />
//       <NumberDisplay small num={ms} />
//     </div>
//   )
// }

function TimerIcon() {
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
