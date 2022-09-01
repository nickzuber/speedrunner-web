import { ComponentStory, ComponentMeta } from "@storybook/react"

import { Badge, BadgeColors, BadgeIcons } from "../components/Badge"

export default {
  title: "Badge",
  component: Badge,
} as ComponentMeta<typeof Badge>

const Template: ComponentStory<any> = ({ ...args }) => {
  return <Badge {...args} />
}

export const Green = Template.bind({})
Green.args = {
  time: 1000 * 60 + Math.random() * 20000,
  color: BadgeColors.Green,
  icon: BadgeIcons.Up,
}

export const Red = Template.bind({})
Red.args = {
  time: 1000 * 60 * 4 + Math.random() * 20000,
  color: BadgeColors.Red,
  icon: BadgeIcons.Down,
}

export const Gold = Template.bind({})
Gold.args = {
  time: 1000 * 60 * 14 + Math.random() * 20000,
  color: BadgeColors.Gold,
  icon: BadgeIcons.Crown,
}
