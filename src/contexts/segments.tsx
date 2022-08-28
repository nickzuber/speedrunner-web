import React, { FC, createContext } from "react"
import { SegmentsOptions, useSegments } from "../hooks/useSegments"

export const SegmentsContext = createContext<SegmentsOptions | null>(
  null
) as React.Context<SegmentsOptions>

type Props = {
  children: React.ReactNode
}

export const SegmentsProvider: FC<Props> = ({ children }) => {
  const state = useSegments()

  return (
    <SegmentsContext.Provider value={state}>
      {children}
    </SegmentsContext.Provider>
  )
}
