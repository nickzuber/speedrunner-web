import createPersistedState from "use-persisted-state"
import { PersistedState } from "../constants/persisted"

export type PersistedStateT<T> = [T, React.Dispatch<T>]

export function createState<T>(name: string): (args: T) => PersistedStateT<T> {
  return createPersistedState(PersistedState.Segments)
}
