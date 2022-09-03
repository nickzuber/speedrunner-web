import React, { CSSProperties, FC } from "react"
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

const backgroundColors: Record<BadgeColors, string> = {
  [BadgeColors.Red]: "#ff1a44",
  [BadgeColors.Green]: "#37b24d",
  [BadgeColors.Gold]: "#fab005",
}

const foregroundColors: Record<BadgeColors, string> = {
  [BadgeColors.Red]: "#fff",
  [BadgeColors.Green]: "#fff",
  [BadgeColors.Gold]: "#fff",
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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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

export interface BadgeProps {
  color: BadgeColors
  icon: BadgeIcons
  width?: number
  time?: number
  size?: number
  fadeIn?: boolean
  style?: CSSProperties
}

export const Badge: FC<BadgeProps> = ({
  time,
  color,
  icon,
  width,
  size,
  fadeIn,
  style,
}) => {
  const formattedTs = time
    ? time >= 1000 * 60 * 60
      ? "Lots!"
      : time >= 1000 * 60
      ? formatTimestamp(time).split(".")[0]
      : time >= 1000 * 10
      ? formatTimestamp(time).slice(0, -1)
      : formatTimestamp(time)
    : "--.--"

  return (
    <div
      className={fadeIn ? "fade-in" : undefined}
      style={{
        fontSize: 12,
        fontWeight: 600,
        width: width || "fit-content",
        padding: "1px 6px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: width ? undefined : "center",
        boxSizing: "border-box",
        borderRadius: 4,
        background: backgroundColors[color],
        color: foregroundColors[color],
        transform: `scale(${size ? size : 0.85})`,
        ...style,
      }}
    >
      {badgeIcons[icon]}
      {formattedTs}
    </div>
  )
}
