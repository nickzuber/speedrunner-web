import { ComponentStory, ComponentMeta } from "@storybook/react"

import { Actions } from "../components/Actions"
import { Mocks } from "../constants/mocks"
import { SegmentsProvider } from "../contexts/segments"

import { IPhoneContainer } from "./IPhoneContainer"

export default {
  title: "Actions",
  component: Actions,
} as ComponentMeta<typeof Actions>

const Template: ComponentStory<any> = ({ stack, ...args }) => {
  return (
    <SegmentsProvider stackMock={stack}>
      <IPhoneContainer>
        <Actions {...args} />
      </IPhoneContainer>
    </SegmentsProvider>
  )
}

export const Queued = Template.bind({})
Queued.args = {
  stack: Mocks.Stacks.queued,
}

export const Running = Template.bind({})
Running.args = {
  stack: Mocks.Stacks.running,
}

export const Completed = Template.bind({})
Completed.args = {
  stack: Mocks.Stacks.completed,
}
