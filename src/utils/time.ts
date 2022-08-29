export function formatTimestamp(ts: number): string {
  if (ts < 0) {
    return "-"
  }

  const seconds = ts / 1000
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (minutes === 0) {
    return `${(seconds % 60).toFixed(2)}`
  }

  if (hours === 0) {
    return `${minutes % 60}:${(seconds % 60).toFixed(2).padStart(5, "0")}`
  }

  return `${hours}:${minutes % 60}:${(seconds % 60)
    .toFixed(2)
    .padStart(4, "0")}`
}

export function formatSeconds(seconds: number): string {
  return `${(seconds % 60).toFixed(2)}`
}
