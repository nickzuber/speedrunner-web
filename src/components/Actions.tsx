import React, {
  CSSProperties,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { SegmentsContext } from "../contexts/segments"
import {
  isCompletedSegmentStack,
  isQueuedSegment,
  isQueuedSegmentStack,
  isRunningSegment,
  isRunningSegmentStack,
} from "../utils/segments"
import { formatTimestamp } from "../utils/time"

interface ActionsProps {}

export const Actions: FC<ActionsProps> = () => {
  const [idle, setIdle] = useState(false)
  const timout = useRef<any>()
  const { stack, advanceStack, fullResetStack, resetStack, saveAndResetStack } =
    useContext(SegmentsContext)

  useEffect(() => () => clearTimeout(timout.current), [])

  if (isCompletedSegmentStack(stack)) {
    return (
      <div
        style={{
          margin: "24px auto 0",
          width: "calc(100% - 48px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <button
          key="discard"
          className="action-idle-button"
          disabled={idle}
          onClick={() => {
            resetStack()
            setIdle(true)
            timout.current = setTimeout(() => setIdle(false), 3000)
            const elem = document.querySelector(`#segment-0`)
            console.info(elem)
            if (elem) {
              elem.scrollIntoView({
                behavior: "smooth",
              })
            }
          }}
        >
          {"Discard"}
        </button>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <button
          key="save"
          className="action-button"
          disabled={idle}
          onClick={() => {
            saveAndResetStack()
            setIdle(true)
            timout.current = setTimeout(() => setIdle(false), 3000)
            const elem = document.querySelector(`#segment-0`)
            if (elem) {
              elem.scrollIntoView({
                behavior: "smooth",
              })
            }
          }}
        >
          {"Save"}
        </button>
      </div>
    )
  }

  if (isQueuedSegmentStack(stack)) {
    return (
      <div
        style={{
          margin: "24px auto 0",
          width: "calc(100% - 48px)",
        }}
      >
        <button
          key="start"
          className="action-button"
          disabled={idle}
          onClick={() => {
            advanceStack()
          }}
        >
          {"Start"}
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        margin: "24px auto 0",
        width: "calc(100% - 48px)",
      }}
    >
      <button
        key={stack.queued.length === 0 ? "finish" : "next"}
        className="action-button"
        onClick={() => {
          advanceStack()

          if (stack.queued.length === 0) {
            setIdle(true)
            timout.current = setTimeout(() => setIdle(false), 3000)
          }
        }}
      >
        {stack.queued.length === 0 ? "Finish" : "Next →"}
      </button>
    </div>
  )
}
