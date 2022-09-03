import { useState } from "react"
import { Mocks } from "../constants/mocks"
import { SegmentStack } from "../types/segments"
import {
  completeRunningSegment,
  createNewSegment,
  fullResetStack,
  resetStack,
  saveAndResetStack,
  saveStackPersonalBests,
} from "../utils/segments"
import { SegmentsOptions } from "./useSegments"

export function useSegmentsMock(initialStack?: SegmentStack): SegmentsOptions {
  const [stack, setStack] = useState<SegmentStack>(
    initialStack || Mocks.Stacks.queued
  )

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
      attempts: 0,
      average: 0,
    })
  }
  return {
    stack,
    advanceStack,
    fullResetStack: () => setStack(fullResetStack(stack)),
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
