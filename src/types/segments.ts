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

export interface BaseSegmentStack {
  pb?: number
  attempts: number
  average: number
}

export interface QueuedSegmentStack extends BaseSegmentStack {
  queued: Array<QueuedSegment>
  running: null
  completed: []
}

export interface RunningSegmentStack extends BaseSegmentStack {
  queued: Array<QueuedSegment>
  running: RunningSegment
  completed: Array<CompletedSegment>
}

export interface CompletedSegmentStack extends BaseSegmentStack {
  queued: []
  running: null
  completed: Array<CompletedSegment>
}

export type SegmentStack =
  | QueuedSegmentStack
  | RunningSegmentStack
  | CompletedSegmentStack
