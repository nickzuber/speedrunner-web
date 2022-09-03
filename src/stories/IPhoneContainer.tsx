import { FC } from "react"

interface IPhoneContainerProps {
  children: React.ReactNode
}

export const IPhoneContainer: FC<IPhoneContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        width: 420,
        background: "#fff",
        margin: "24px auto",
      }}
    >
      {children}
    </div>
  )
}
