import { ComponentStory, ComponentMeta } from "@storybook/react"

import { SegmentTimer } from "../components/SegmentTimer"
import { SegmentsProvider } from "../contexts/segments"
import { Mocks } from "../constants/mocks"
import { useTimer } from "../hooks/useTimer"
import { IPhoneContainer } from "./IPhoneContainer"

export default {
  title: "SegmentTimer",
  component: SegmentTimer,
} as ComponentMeta<typeof SegmentTimer>

const Template: ComponentStory<any> = ({
  stack,
  isRunning,
  offset,
  ...args
}) => {
  const time = useTimer(isRunning, offset)

  return (
    <SegmentsProvider stackMock={stack}>
      <IPhoneContainer>
        <SegmentTimer {...args} time={time} index={0} />
      </IPhoneContainer>
    </SegmentsProvider>
  )
}

export const Queued = Template.bind({})
Queued.args = {
  isRunning: false,
  stack: Mocks.Stacks.queued,
  segment: Mocks.Stacks.queued.queued[0],
}

export const Running = Template.bind({})
Running.args = {
  isRunning: true,
  offset: 1000 * 60 * 4,
  stack: Mocks.Stacks.running,
  segment: Mocks.Stacks.running.running,
}

export const Completed = Template.bind({})
Completed.args = {
  isRunning: false,
  offset: 1000 * 60 * 12 + Math.random(),
  stack: Mocks.Stacks.completed,
  segment: Mocks.Stacks.completed.completed[0],
}
