import React, { FC, createContext } from "react"
import { SegmentsOptions, useSegments } from "../hooks/useSegments"
import { useSegmentsMock } from "../hooks/useSegments.mock"
import { SegmentStack } from "../types/segments"

export const SegmentsContext = createContext<SegmentsOptions | null>(
  null
) as React.Context<SegmentsOptions>

type Props = {
  children: React.ReactNode
  stackMock?: SegmentStack
}

export const SegmentsProvider: FC<Props> = ({ stackMock, children }) => {
  const state = useSegments()
  const mockState = useSegmentsMock(stackMock)

  return (
    <SegmentsContext.Provider value={stackMock ? mockState : state}>
      {children}
    </SegmentsContext.Provider>
  )
}
