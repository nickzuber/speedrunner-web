import { v4 as uuidv4 } from "uuid"
import {
  CompletedSegment,
  CompletedSegmentStack,
  RunningSegmentStack,
  QueuedSegmentStack,
  QueuedSegment,
  RunningSegment,
  Segment,
  SegmentStack,
} from "../types/segments"

export function createNewSegment(
  name: string,
  desc: string,
  pb?: number
): QueuedSegment {
  return {
    id: uuidv4(),
    name,
    desc,
    start: null,
    end: null,
    pb,
  }
}

export function createRunningSegment(
  name: string,
  desc: string
): RunningSegment {
  return {
    id: uuidv4(),
    name,
    desc,
    start: Date.now(),
    end: null,
  }
}

export function createCompletedSegment(
  name: string,
  desc: string
): CompletedSegment {
  return {
    id: uuidv4(),
    name,
    desc,
    start: Date.now(),
    end: Date.now() + 15 * 60 * 1000,
  }
}

export function isQueuedSegmentStack(
  stack: SegmentStack
): stack is QueuedSegmentStack {
  return (
    stack.queued.length > 0 &&
    stack.running === null &&
    stack.completed.length === 0
  )
}

export function isRunningSegmentStack(
  stack: SegmentStack
): stack is RunningSegmentStack {
  return stack.running !== null
}

export function isCompletedSegmentStack(
  stack: SegmentStack
): stack is CompletedSegmentStack {
  return (
    stack.queued.length === 0 &&
    stack.running === null &&
    stack.completed.length > 0
  )
}

export function isQueuedSegment(segment: Segment): segment is QueuedSegment {
  return segment.start === null
}

export function isRunningSegment(segment: Segment): segment is RunningSegment {
  return segment.start !== null && segment.end === null
}

export function isCompletedSegment(
  segment: Segment
): segment is CompletedSegment {
  return segment.start !== null && segment.end !== null
}

export function resetSegment(segment: Segment): QueuedSegment {
  return {
    ...segment,
    start: null,
    end: null,
  }
}

export function fullResetSegment(segment: Segment): QueuedSegment {
  return {
    ...segment,
    pb: undefined,
    start: null,
    end: null,
  }
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function fullResetStack(
  stack: SegmentStack,
  clearStorage = false
): QueuedSegmentStack {
  if (clearStorage) {
    localStorage.clear()
  }

  return {
    ...stack,
    queued: [
      ...stack.completed.map(resetSegment),
      stack.running ? resetSegment(stack.running) : null,
      ...stack.queued,
    ]
      .filter(notEmpty)
      .map(fullResetSegment),
    running: null,
    completed: [],
  }
}

export function resetStack(stack: SegmentStack): QueuedSegmentStack {
  return {
    ...stack,
    queued: [
      ...stack.completed.map(resetSegment),
      stack.running ? resetSegment(stack.running) : null,
      ...stack.queued,
    ].filter(notEmpty),
    running: null,
    completed: [],
  }
}

export function getSegmentSplit(segment: CompletedSegment): number {
  return segment.end - segment.start
}

export function saveSegmentPersonalBest(
  segment: CompletedSegment
): CompletedSegment {
  const split = getSegmentSplit(segment)
  return {
    ...segment,
    pb: segment.pb ? Math.min(split, segment.pb) : split,
  }
}

export function getCompletedStackTime(stack: CompletedSegmentStack): number {
  return stack.completed.reduce(
    (sum, segment) => sum + getSegmentSplit(segment),
    0
  )
}

export function getTheoreticalBestTime(stack: SegmentStack): number {
  if (isCompletedSegmentStack(stack)) {
    return stack.completed.reduce(
      (total, segment) => (total += segment.pb || 0),
      0
    )
  } else if (isQueuedSegmentStack(stack)) {
    return stack.queued.reduce(
      (total, segment) => (total += segment.pb || 0),
      0
    )
  } else if (isRunningSegmentStack(stack)) {
    const bestQueued = stack.queued.reduce(
      (total, segment) => (total += segment.pb || 0),
      0
    )
    const bestCompleted = stack.completed.reduce(
      (total, segment) => (total += segment.pb || 0),
      0
    )
    const bestRunning = stack.running.pb || 0
    return bestQueued + bestCompleted + bestRunning
  }

  return 0
}

export function saveAndResetStack(stack: SegmentStack): QueuedSegmentStack {
  if (!isCompletedSegmentStack(stack)) {
    throw new Error("Tried to save and reset an incomplete segment stack.")
  }

  const savedStack = saveStackPersonalBests(stack)
  return resetStack(savedStack)
}

export function saveStackPersonalBests(
  stack: SegmentStack
): CompletedSegmentStack {
  if (!isCompletedSegmentStack(stack)) {
    throw new Error("Tried to save an incomplete segment stack.")
  }

  const totalTimeFromAttempt = getCompletedStackTime(stack)

  return {
    queued: stack.queued,
    running: stack.running,
    completed: stack.completed.map(saveSegmentPersonalBest),
    pb: stack.pb
      ? Math.min(stack.pb, totalTimeFromAttempt)
      : totalTimeFromAttempt,
    attempts: stack.attempts + 1,
    average:
      (stack.average * stack.attempts + totalTimeFromAttempt) /
      (stack.attempts + 1),
  }
}

export function completeSegment(segment: RunningSegment): CompletedSegment {
  const end = Date.now()
  return {
    ...segment,
    end,
  }
}

export function completeRunningSegment(stack: SegmentStack) {
  // Empty stacks are ones that have not been initialized with any segments yet.
  if (
    stack.queued.length === 0 &&
    stack.running === null &&
    stack.completed.length === 0
  ) {
    // No-op right now.
    return stack
  }

  // Kick off the first segment.
  if (isQueuedSegmentStack(stack)) {
    const nextSegment = stack.queued.shift()

    if (!nextSegment) {
      throw new Error(
        "Unstarted segment stack did not have any queued segments."
      )
    }

    const runningNextSegment: RunningSegment = {
      ...nextSegment,
      start: Date.now(),
      end: null,
    }

    return {
      ...stack,
      queued: stack.queued,
      running: runningNextSegment,
      completed: stack.completed,
    } as RunningSegmentStack
  }

  // Complete out the running segment and begin the next queued one.
  if (isRunningSegmentStack(stack)) {
    const completedSegment = completeSegment(stack.running)

    const nextSegment = stack.queued.shift()

    // The final segment was completed.
    if (!nextSegment) {
      return {
        ...stack,
        queued: [],
        running: null,
        completed: [...stack.completed, completedSegment],
      } as CompletedSegmentStack
    }

    const runningNextSegment: RunningSegment = {
      ...nextSegment,
      start: Date.now(),
      end: null,
    }

    return {
      ...stack,
      queued: stack.queued,
      running: runningNextSegment,
      completed: [...stack.completed, completedSegment],
    } as RunningSegmentStack
  }

  // The stack must already be completed. This is a no-op right now.
  // TODO(nickz) Should we throw an error?
  return stack
}

export function getLengthOfSegment(segment: CompletedSegment) {
  return segment.end - segment.start
}

export function getTimeRanInSegmentSoFar(segment: RunningSegment) {
  return Date.now() - segment.start
}

export function getTotalTimeRanSoFar(stack: RunningSegmentStack) {
  const lastCompletedSegment =
    stack.completed.length > 0
      ? stack.completed[stack.completed.length - 1]
      : undefined

  const timeLastSegmentWasCompleted = lastCompletedSegment
    ? getLengthOfSegment(lastCompletedSegment)
    : 0

  return timeLastSegmentWasCompleted + getTimeRanInSegmentSoFar(stack.running)
}

export function getEstimatedTimeLeft(stack: RunningSegmentStack) {
  return stack.average - getTotalTimeRanSoFar(stack)
}

// @TODO Doesn't work if there are no PBs really.
export function getEstimatedPace(stack: RunningSegmentStack) {
  const segmentsToGo = stack.queued.reduce(
    (sum, segment) => sum + (segment.pb || 0),
    0
  )
  const timeLeftInRunningSegment =
    (stack.running.pb || 0) - (Date.now() - stack.running.start)
  return segmentsToGo + timeLeftInRunningSegment
}
