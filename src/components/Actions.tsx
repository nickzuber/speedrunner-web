import React, { FC, useContext, useEffect, useRef, useState } from "react"
import { SegmentsContext } from "../contexts/segments"
import {
  isCompletedSegmentStack,
  isQueuedSegmentStack,
} from "../utils/segments"

interface ActionsProps {}

function scrollToTopOfSegments() {
  const elem = document.querySelector(`#segment-0`)
  if (elem) {
    elem.scrollIntoView({
      behavior: "smooth",
    })
  }
}

const RenderWithDisabled: FC<{
  render: (disabled: boolean) => React.ReactNode
  duration?: number
}> = ({ render, duration }) => {
  const timout = useRef<any>()
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    timout.current = setTimeout(() => setDisabled(false), duration || 3000)
    return () => clearTimeout(timout.current)
  }, [])

  return <>{render(disabled)}</>
}

export const Actions: FC<ActionsProps> = () => {
  const [idle, setIdle] = useState(false)
  const timout = useRef<any>()
  const { stack, advanceStack, resetStack, saveAndResetStack } =
    useContext(SegmentsContext)

  useEffect(() => () => clearTimeout(timout.current), [])

  if (isCompletedSegmentStack(stack)) {
    return (
      <div
        style={{
          margin: "6px auto 0",
          width: "calc(100% - 48px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <RenderWithDisabled
          render={(disabled) => (
            <button
              key="discard"
              disabled={disabled}
              className="action-idle-button"
              onClick={() => {
                setIdle(true)
                timout.current = setTimeout(() => setIdle(false), 3000)

                resetStack()
                scrollToTopOfSegments()
              }}
            >
              {"Discard"}
            </button>
          )}
        />
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <RenderWithDisabled
          render={(disabled) => (
            <button
              key="save"
              disabled={disabled}
              className="action-button"
              onClick={() => {
                setIdle(true)
                timout.current = setTimeout(() => setIdle(false), 3000)

                saveAndResetStack()
                scrollToTopOfSegments()
              }}
            >
              {"Save"}
            </button>
          )}
        />
      </div>
    )
  }

  if (isQueuedSegmentStack(stack)) {
    return (
      <div
        style={{
          margin: "6px auto 0",
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
        margin: "6px auto 0",
        width: "calc(100% - 48px)",
      }}
    >
      <button
        key={stack.queued.length === 0 ? "finish" : "next"}
        className="action-button"
        onClick={() => {
          advanceStack()
        }}
      >
        {stack.queued.length === 0 ? "Finish" : "Next →"}
      </button>
    </div>
  )
}
