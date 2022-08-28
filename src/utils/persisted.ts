import createPersistedState from "use-persisted-state"
import { PersistedState } from "../constants/persisted"

export type PersistedStateT<T> = [T, React.Dispatch<T>]

export function createState<T>(
  name: PersistedState
): (args: T) => PersistedStateT<T> {
  return createPersistedState(name)
}
