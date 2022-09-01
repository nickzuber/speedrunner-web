import { FC } from "react"

interface IPhoneContainerProps {
  children: React.ReactNode
}

export const IPhoneContainer: FC<IPhoneContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        width: 340,
        background: "#EDECED",
        margin: "24px auto",
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  )
}
