import { ComponentStory, ComponentMeta } from "@storybook/react"

import { Timer } from "../components/Timer"
import { SegmentsProvider } from "../contexts/segments"
import { Mocks } from "../constants/mocks"
import { useTimer } from "../hooks/useTimer"
import { IPhoneContainer } from "./IPhoneContainer"

export default {
  title: "Timer",
  component: Timer,
} as ComponentMeta<typeof Timer>

const Template: ComponentStory<any> = ({
  stack,
  isRunning,
  offset,
  ...args
}) => {
  const time = useTimer(isRunning, offset)

  if (args.offsets) {
    return (
      <SegmentsProvider stackMock={stack}>
        <IPhoneContainer>
          {args.offsets.map((offset: number) => (
            <Timer key={offset} time={time + offset} />
          ))}
        </IPhoneContainer>
      </SegmentsProvider>
    )
  }

  return (
    <SegmentsProvider stackMock={stack}>
      <IPhoneContainer>
        <Timer {...args} time={time} />
      </IPhoneContainer>
    </SegmentsProvider>
  )
}

export const Queued = Template.bind({})
Queued.args = {
  isRunning: false,
  stack: Mocks.Stacks.queued,
}

export const Running = Template.bind({})
Running.args = {
  isRunning: true,
  offset: 1000 * 60 * 4,
  stack: Mocks.Stacks.running,
}

export const Completed = Template.bind({})
Completed.args = {
  isRunning: false,
  offset: 1000 * 60 * 12,
  stack: Mocks.Stacks.completed,
}

export const ManyTimes = Template.bind({})
ManyTimes.args = {
  isRunning: false,
  offsets: [
    1000 * 60 * 0,
    1000 * 60 * 1,
    1000 * 60 * 5,
    1000 * 60 * 12,
    1000 * 60 * 22,
    1000 * 60 * 32,
    1000 * 60 * 42,
    1000 * 60 * 52,
    1000 * 60 * 62,
    1000 * 60 * 72,
    1000 * 60 * 92,
    1000 * 60 * 162,
  ],
  stack: Mocks.Stacks.completed,
}
