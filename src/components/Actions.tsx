import React, {
  CSSProperties,
  FC,
  useContext,
  useEffect,
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
  const { stack, advanceStack, fullResetStack, resetStack, saveAndResetStack } =
    useContext(SegmentsContext)

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
          className="action-idle-button"
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
            setTimeout(() => setIdle(false), 3000)
          }
        }}
      >
        {stack.queued.length === 0 ? "Finish" : "Next →"}
      </button>
    </div>
  )
}
