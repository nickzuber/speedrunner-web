import { SegmentStack } from "../types/segments"
import {
  createCompletedSegment,
  createNewSegment,
  createRunningSegment,
  isCompletedSegmentStack,
  isQueuedSegmentStack,
  isRunningSegmentStack,
} from "../utils/segments"

function withPbs<T extends SegmentStack>(stack: T): T {
  if (isQueuedSegmentStack(stack)) {
    return {
      ...stack,
      queued: stack.queued.map((seg) => ({
        ...seg,
        pb: 1000 * 60 * 5 + 12345,
      })),
    }
  } else if (isRunningSegmentStack(stack)) {
    return {
      ...stack,
      queued: stack.queued.map((seg) => ({
        ...seg,
        pb: 1000 * 60 * 5 + 12345,
      })),
      completed: stack.completed.map((seg) => ({
        ...seg,
        pb: 1000 * 60 * 5 + 12345,
      })),
      running: { ...stack.running, pb: 1000 * 60 * 5 + 12345 },
    }
  } else if (isCompletedSegmentStack(stack)) {
    return {
      ...stack,
      completed: stack.completed.map((seg) => ({
        ...seg,
        pb: 1000 * 60 * 5 + 12345,
      })),
    }
  }

  return stack
}

const queuedStack: SegmentStack = withPbs({
  queued: [
    createNewSegment("(1) Get to the J"),
    createNewSegment("(2) J arrives"),
    createNewSegment("(3) Get to Canal"),
    createNewSegment("(4) Elevator doors close"),
  ],
  running: null,
  completed: [],
})

const runningStack: SegmentStack = withPbs({
  queued: [createNewSegment("(4) Elevator doors close")],
  running: createRunningSegment("(3) Get to Canal"),
  completed: [
    createCompletedSegment("(1) Get to the J"),
    createCompletedSegment("(2) J arrives"),
  ],
})

const completedStack: SegmentStack = withPbs({
  queued: [],
  running: null,
  completed: [
    createCompletedSegment("(1) Get to the J"),
    createCompletedSegment("(2) J arrives"),
    createCompletedSegment("(3) Get to Canal"),
    createCompletedSegment("(4) Elevator doors close"),
  ],
})

export const Mocks = {
  Stacks: {
    queued: queuedStack,
    running: runningStack,
    completed: completedStack,
  },
}
