export function formatTimestamp(ts: number): string {
  const seconds = ts / 1000
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (minutes === 0) {
    return `${formatSeconds(seconds)}`
  }

  if (hours === 0) {
    return `${minutes}:${formatSeconds(seconds)}`
  }

  return `${hours}:${minutes}:${formatSeconds(seconds)}`
}

export function formatSeconds(seconds: number): string {
  return `${seconds.toFixed(2)}`
}
