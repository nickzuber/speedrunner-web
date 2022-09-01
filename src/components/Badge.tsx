import React, { FC } from "react"
import { formatTimestamp } from "../utils/time"

export enum BadgeColors {
  Green = "green",
  Red = "red",
  Gold = "gold",
}

export enum BadgeIcons {
  Crown = "crown",
  Down = "down",
  Up = "up",
}

export interface BadgeProps {
  time?: number
  color: BadgeColors
  icon: BadgeIcons
}

const backgroundColors: Record<BadgeColors, string> = {
  [BadgeColors.Red]: "#FFCBCB",
  [BadgeColors.Green]: "#D0E7DB",
  [BadgeColors.Gold]: "#FFE08F",
}

const foregroundColors: Record<BadgeColors, string> = {
  [BadgeColors.Red]: "#BA0707",
  [BadgeColors.Green]: "#128748",
  [BadgeColors.Gold]: "#B78401",
}

const badgeIcons: Record<BadgeIcons, React.ReactNode> = {
  [BadgeIcons.Crown]: (
    <svg
      width="10"
      height="9"
      viewBox="0 0 10 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 4 }}
    >
      <path
        d="M1 6.88V1L3.34483 4.08L5 1L6.65517 4.08L9 1V6.88C9 6.88 8.31034 8 5 8C1.68966 8 1 6.88 1 6.88Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  [BadgeIcons.Down]: (
    <svg
      width="10px"
      height="16px"
      fill="none"
      viewBox="0 0 10 16"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 4, transform: "rotate(180deg)" }}
    >
      <path
        d="M3.691 5.563 1.055 8.43c-.786.855-.18 2.236.981 2.236h5.928c1.16 0 1.767-1.381.981-2.236L6.31 5.563a1.778 1.778 0 0 0-2.618 0Z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  [BadgeIcons.Up]: (
    <svg
      width="10px"
      height="16px"
      fill="none"
      viewBox="0 0 10 16"
      style={{ marginRight: 4 }}
    >
      <path
        d="M3.691 5.563 1.055 8.43c-.786.855-.18 2.236.981 2.236h5.928c1.16 0 1.767-1.381.981-2.236L6.31 5.563a1.778 1.778 0 0 0-2.618 0Z"
        fill="currentColor"
      ></path>
    </svg>
  ),
}

export const Badge: FC<BadgeProps> = ({ time, color, icon }) => {
  const formattedTs = time
    ? time >= 1000 * 60
      ? formatTimestamp(time).split(".")[0]
      : formatTimestamp(time)
    : "--.--"

  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 500,
        width: "fit-content",
        padding: "0px 4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        borderRadius: 4,
        background: backgroundColors[color],
        color: foregroundColors[color],
        transform: "scale(0.85)",
      }}
    >
      {badgeIcons[icon]}
      {formattedTs}
    </div>
  )
}
