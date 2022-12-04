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
    createNewSegment("Get to the J", "Blah."),
    createNewSegment("J arrives", "Blah."),
    createNewSegment("Get to the Canal Street subway stop", "Blah."),
    createNewSegment("Elevator doors close", "Blah."),
  ],
  running: null,
  completed: [],
  attempts: 1,
  average: 0,
})

const runningStack: SegmentStack = withPbs({
  queued: [createNewSegment("Elevator doors close", "Blah.")],
  running: createRunningSegment("Get to the Canal Street subway stop", "Blah."),
  completed: [
    createCompletedSegment("Get to the J", "Blah."),
    createCompletedSegment("J arrives", "Blah."),
  ],
  attempts: 1,
  average: 0,
})

const completedStack: SegmentStack = withPbs({
  queued: [],
  running: null,
  completed: [
    createCompletedSegment("Get to the J", "Blah."),
    createCompletedSegment("J arrives", "Blah."),
    createCompletedSegment("Get to the Canal Street subway stop", "Blah."),
    createCompletedSegment("Elevator doors close", "Blah."),
  ],
  attempts: 1,
  average: 0,
})

export const Mocks = {
  Stacks: {
    queued: queuedStack,
    running: runningStack,
    completed: completedStack,
  },
}
