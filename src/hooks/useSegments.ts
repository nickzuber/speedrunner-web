import { PersistedState } from "../constants/persisted"
import { QueuedSegment, Segment, SegmentStack } from "../types/segments"
import { createState } from "../utils/persisted"
import {
  completeRunningSegment,
  createNewSegment,
  resetStack,
} from "../utils/segments"

const useSegmentStackState = createState<SegmentStack>(PersistedState.Stack)

// @TODO(nickz) hard-coded, will delete later
const initialSegments: Array<QueuedSegment> = [
  createNewSegment("Get to the J"),
  createNewSegment("J arrives"),
  createNewSegment("Get to Canal"),
  createNewSegment("Elevator doors close"),
]
const initialStack: SegmentStack = {
  queued: initialSegments,
  running: null,
  completed: [],
}

export type SegmentsOptions = {
  stack: SegmentStack
  resetStack: () => void
  advanceStack: () => void
  updateSegment: (id: string, newName: string) => void
  moveSegment: (id: string, newPosition: number) => void
  addNewSegment: (name: string) => void
  deleteSegment: (id: string) => void
  clearSegments: () => void
}

export function useSegments(): SegmentsOptions {
  const [stack, setStack] = useSegmentStackState(initialStack)

  function updateSegment(id: string, newName: string) {
    const initialStack = resetStack(stack)
    initialStack.queued = initialStack.queued.map((segment) => {
      if (segment.id === id) {
        return {
          ...segment,
          name: newName,
        }
      }
      return segment
    })
    setStack(initialStack)
  }

  function moveSegment(id: string, newPosition: number) {
    const initialStack = resetStack(stack)
    const segmentsWithoutMovedSegment = initialStack.queued.filter(
      (segment) => segment.id !== id
    )
    const movedSegment = initialStack.queued.find(
      (segment) => segment.id === id
    )

    if (!movedSegment) {
      throw new Error("Unable to find target segment to move")
    }

    const queued = []
    for (let i = 0; i < segmentsWithoutMovedSegment.length; i++) {
      if (i === newPosition) {
        queued.push(movedSegment)
      }
      queued.push(segmentsWithoutMovedSegment[i])
    }

    initialStack.queued = queued
    setStack(initialStack)
  }

  function addNewSegment(name: string) {
    const initialStack = resetStack(stack)
    initialStack.queued = [...initialStack.queued, createNewSegment(name)]
    setStack(initialStack)
  }

  function deleteSegment(id: string) {
    const initialStack = resetStack(stack)
    initialStack.queued = initialStack.queued.filter(
      (segment) => segment.id !== id
    )
    setStack(initialStack)
  }

  function advanceStack() {
    const nextStack = completeRunningSegment(stack)
    setStack(nextStack)
  }

  function clearSegments() {
    setStack({
      queued: [],
      running: null,
      completed: [],
    })
  }

  return {
    stack,
    advanceStack,
    resetStack: () => setStack(resetStack(stack)),
    updateSegment,
    moveSegment,
    addNewSegment,
    deleteSegment,
    clearSegments,
  }
}
