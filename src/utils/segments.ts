import { v4 as uuidv4 } from "uuid"
import {
  CompletedSegment,
  EmptySegmentStack,
  FinishedSegmentStack,
  InProgressSegmentStack,
  NotStartedSegmentStack,
  QueuedSegment,
  RunningSegment,
  Segment,
  SegmentStack,
} from "../types/segments"

export function createNewSegment(name: string): QueuedSegment {
  return {
    id: uuidv4(),
    name,
    start: null,
    end: null,
  }
}

export function isEmptySegmentStack(
  stack: SegmentStack
): stack is EmptySegmentStack {
  return (
    stack.queued.length === 0 &&
    stack.running === null &&
    stack.completed.length === 0
  )
}

export function isNotStartedSegmentStack(
  stack: SegmentStack
): stack is NotStartedSegmentStack {
  return (
    stack.queued.length > 0 &&
    stack.running === null &&
    stack.completed.length === 0
  )
}

export function isInProgressSegmentStack(
  stack: SegmentStack
): stack is InProgressSegmentStack {
  return stack.running !== null
}

export function isFinishedSegmentStack(
  stack: SegmentStack
): stack is FinishedSegmentStack {
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

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined
}

export function resetStack(stack: SegmentStack): NotStartedSegmentStack {
  return {
    queued: [
      ...stack.queued,
      stack.running ? resetSegment(stack.running) : null,
      ...stack.completed.map(resetSegment),
    ].filter(notEmpty),
    running: null,
    completed: [],
  }
}

export function completeRunningSegment(stack: SegmentStack) {
  // Empty stacks are ones that have not been initialized with any segments yet.
  if (isEmptySegmentStack(stack)) {
    // No-op right now.
    return stack
  }

  // Kick off the first segment.
  if (isNotStartedSegmentStack(stack)) {
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
      queued: stack.queued,
      running: runningNextSegment,
      completed: stack.completed,
    } as InProgressSegmentStack
  }

  // Complete out the running segment and begin the next queued one.
  if (isInProgressSegmentStack(stack)) {
    const completedSegment: CompletedSegment = {
      ...stack.running,
      end: Date.now(),
    }

    const nextSegment = stack.queued.shift()

    // The final segment was completed.
    if (!nextSegment) {
      return {
        queued: [],
        running: null,
        completed: [...stack.completed, completedSegment],
      } as FinishedSegmentStack
    }

    const runningNextSegment: RunningSegment = {
      ...nextSegment,
      start: Date.now(),
      end: null,
    }

    return {
      queued: stack.queued,
      running: runningNextSegment,
      completed: [...stack.completed, completedSegment],
    } as InProgressSegmentStack
  }

  // The stack must already be completed. This is a no-op right now.
  // TODO(nickz) Should we throw an error?
  return stack
}
