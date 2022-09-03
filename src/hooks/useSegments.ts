import { PersistedState } from "../constants/persisted"
import { QueuedSegment, Segment, SegmentStack } from "../types/segments"
import { createState } from "../utils/persisted"
import {
  completeRunningSegment,
  createNewSegment,
  fullResetStack,
  resetStack,
  saveAndResetStack,
  saveStackPersonalBests,
} from "../utils/segments"
import { parseStringForMs } from "../utils/time"

const useSegmentStackState = createState<SegmentStack>(PersistedState.Stack)

// @TODO(nickz) hard-coded, will delete later
const getInitialSegments = (): Array<QueuedSegment> => [
  createNewSegment("Subway platform", parseStringForMs("6:34.11")),
  createNewSegment("Doors open", parseStringForMs("0.38")),
  createNewSegment("Exit subway", parseStringForMs("15:37.50")),
  createNewSegment("Enter the elevator", parseStringForMs("8:39.14")),
]
const getInitialStack = (): SegmentStack => ({
  queued: getInitialSegments(),
  running: null,
  completed: [],
  pb: parseStringForMs("31:39.11"),
})

export type SegmentsOptions = {
  stack: SegmentStack
  fullResetStack: () => void
  resetStack: () => void
  advanceStack: () => void
  updateSegment: (id: string, newName: string) => void
  moveSegment: (id: string, newPosition: number) => void
  addNewSegment: (name: string) => void
  deleteSegment: (id: string) => void
  clearSegments: () => void
  saveSegments: () => void
  saveAndResetStack: () => void
}

export function useSegments(): SegmentsOptions {
  const [stack, setStack] = useSegmentStackState(getInitialStack())

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
    fullResetStack: () => setStack(getInitialStack()),
    resetStack: () => setStack(resetStack(stack)),
    saveSegments: () => setStack(saveStackPersonalBests(stack)),
    saveAndResetStack: () => setStack(saveAndResetStack(stack)),
    updateSegment,
    moveSegment,
    addNewSegment,
    deleteSegment,
    clearSegments,
  }
}
