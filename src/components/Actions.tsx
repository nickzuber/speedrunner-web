import React, {
  CSSProperties,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { PersistedState } from "../constants/persisted"
import { SegmentsContext } from "../contexts/segments"
import { CompletedSegmentStack } from "../types/segments"
import { createState } from "../utils/persisted"
import {
  isCompletedSegmentStack,
  isQueuedSegmentStack,
} from "../utils/segments"

const useSavedStack = createState<CompletedSegmentStack | null>(
  PersistedState.StackSaved
)

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

  useEffect(() => {
    return () => setDisabled(true)
  }, [])

  return <>{render(disabled)}</>
}

const styles: Record<string, CSSProperties> = {
  container: {
    margin: "14px auto 0",
    width: "calc(100% - 48px)",
    display: "flex",
    flexDirection: "row",
  },
}

export const Actions: FC = () => {
  const [savedStack, setSavedStack] = useSavedStack(null)
  const [idle, setIdle] = useState(false)
  const timout = useRef<any>()
  const { stack, advanceStack, resetStack, saveAndResetStack } =
    useContext(SegmentsContext)

  useEffect(() => () => clearTimeout(timout.current), [])

  if (isCompletedSegmentStack(stack)) {
    if (savedStack) {
      return (
        <>
          <div style={styles.container}>
            <RenderWithDisabled
              key="reset"
              render={(disabled) => (
                <button
                  key="reset"
                  disabled={disabled}
                  className="action-idle-button"
                  onClick={() => {
                    setIdle(true)
                    timout.current = setTimeout(() => setIdle(false), 3000)

                    setSavedStack(null)
                    saveAndResetStack()
                    scrollToTopOfSegments()
                  }}
                >
                  {"Clear"}
                </button>
              )}
            />
          </div>
        </>
      )
    }

    return (
      <div style={styles.container}>
        <RenderWithDisabled
          key="discard"
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
          key="save"
          render={(disabled) => (
            <button
              key="save"
              disabled={disabled}
              className="action-button"
              onClick={() => {
                setSavedStack(stack)
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
      <div style={styles.container}>
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
    <div style={styles.container}>
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
