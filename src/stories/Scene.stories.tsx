import { ComponentStory, ComponentMeta } from "@storybook/react"

import { Scene } from "../Scene"
import { Actions } from "../components/Actions"
import { SegmentTimer } from "../components/SegmentTimer"
import { Timer } from "../components/Timer"
import { Mocks } from "../constants/mocks"
import { SegmentsProvider } from "../contexts/segments"
import { useTimer } from "../hooks/useTimer"
import { notEmpty } from "../utils/segments"

import { IPhoneContainer } from "./IPhoneContainer"

export default {
  title: "Scene",
  component: Scene,
} as ComponentMeta<typeof Scene>

const Template: ComponentStory<any> = ({ isRunning, ...args }) => {
  const time = useTimer(isRunning)

  const segments = [
    ...args.stack.completed,
    args.stack.running,
    ...args.stack.queued,
  ].filter(notEmpty)

  return (
    <SegmentsProvider stackMock={Mocks.Stacks.queued}>
      <IPhoneContainer>
        {segments.map((segment, xid) => (
          <SegmentTimer
            key={segment.id}
            time={time}
            segment={segment}
            index={xid}
          />
        ))}
        <Timer time={time} />
        <Actions {...args} />
      </IPhoneContainer>
    </SegmentsProvider>
  )
}

export const NotStarted = Template.bind({})
NotStarted.args = {
  stack: Mocks.Stacks.queued,
}

export const Running = Template.bind({})
Running.args = {
  stack: Mocks.Stacks.running,
  isRunning: true,
}

export const Completed = Template.bind({})
Completed.args = {
  stack: Mocks.Stacks.completed,
}
