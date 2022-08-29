export interface BaseSegment {
  id: string
  name: string
  pb?: number
}

export interface QueuedSegment extends BaseSegment {
  start: null
  end: null
}

export interface RunningSegment extends BaseSegment {
  start: number
  end: null
}

export interface CompletedSegment extends BaseSegment {
  start: number
  end: number
}

export type Segment = QueuedSegment | RunningSegment | CompletedSegment

export interface NotStartedSegmentStack {
  queued: Array<QueuedSegment>
  running: null
  completed: []
}

export interface InProgressSegmentStack {
  queued: Array<QueuedSegment>
  running: RunningSegment
  completed: Array<CompletedSegment>
}

export interface FinishedSegmentStack {
  queued: []
  running: null
  completed: Array<CompletedSegment>
}

export type SegmentStack =
  | NotStartedSegmentStack
  | InProgressSegmentStack
  | FinishedSegmentStack
