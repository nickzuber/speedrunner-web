import { CSSProperties, FC, useContext, useEffect } from "react"

const styles: Record<string, CSSProperties> = {
  container: {
    position: "relative",
    fontSize: 28,
    fontWeight: 500,
    padding: "10px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    margin: "4px 8px",
    borderRadius: 8,
  },
  left: {
    flex: 1.5,
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
    zIndex: 1,
  },
  right: {
    flex: 1,
    textAlign: "right",
    position: "absolute",
    right: 18,
    zIndex: 1,
  },
  name: {
    display: "block",
    fontSize: 18,
    lineHeight: "20px",
    fontWeight: 600,
    width: "50%",
    marginBottom: 4,
  },
  byline: {
    display: "inline-block",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "18px",
    color: "#00000077",
  },
  bylineTextWrapper: {
    display: "inline-block",
    width: 30,
  },
  minutes: {
    display: "inline-block",
    textAlign: "left",
  },
  milliseconds: {
    width: 28,
    display: "inline-block",
    textAlign: "left",
    fontSize: "60%",
    opacity: 0.75,
  },
}

export const SegmentTimelapse: FC = ({}) => {
  return null
}
