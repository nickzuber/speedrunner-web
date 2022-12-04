import { BadgeColors, BadgeIcons } from "../components/Badge"

export function parseTimestamp(ts: number) {
  if (ts < 0) {
    return {
      ms: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
    }
  }

  const ms = Number((ts / 1000).toFixed(2).split(".")[1])
  const seconds = Math.floor(ts / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  return {
    ms,
    seconds: seconds % 60,
    minutes: minutes % 60,
    hours: hours % 60,
  }
}

export function formatTimestamp(ts: number): string {
  if (ts < 0) {
    return "-.-"
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

  return `${hours}:${(minutes % 60).toString().padStart(2, "0")}:${(
    seconds % 60
  )
    .toFixed(2)
    .padStart(5, "0")}`
}

export function formatSeconds(seconds: number): string {
  return `${(seconds % 60).toFixed(2)}`
}

export function getBadgeSplitColor(ts: number, pb?: number) {
  // <=1:30
  return ts <= -1000 * 90
    ? BadgeColors.Gold
    : ts < 0
    ? BadgeColors.Green
    : BadgeColors.Red
}

export function getBadgeSplitIcon(ts: number, pb?: number) {
  // <=1:30
  return ts < 0 ? BadgeIcons.Down : BadgeIcons.Up
}

export function getBadgeSplitWidth(ts: number, running?: boolean) {
  return !running ? undefined : ts > 1000 * 60 * 10 ? 60 : 54
}

// "15:37.50" -> 937050
export function parseStringForMs(str: string) {
  const parts = str
    .split(/(:|\.)/)
    .filter((c) => c !== ":" && c !== ".")
    .reverse()
    .map(Number)
  const multipliers = [1, 1000, 1000 * 60, 1000 * 60]
  let ts = 0,
    multiplierIndex = 0
  for (const part of parts) {
    ts += part * multipliers[multiplierIndex++]
  }
  return ts
}

export function formatDateMs(epochTs: number): string {
  const date = new Date(epochTs).toLocaleTimeString()
  const [time, z] = date.split(" ")
  const [hrs, mins, ms] = time.split(":")
  return `${hrs}:${mins} ${z}`
}
export function getDateMs(epochTs: number): number {
  const date = new Date(epochTs).toLocaleTimeString()
  const [time, z] = date.split(" ")
  const [hrs, mins, ms] = time.split(":")
  return Number(ms)
}
