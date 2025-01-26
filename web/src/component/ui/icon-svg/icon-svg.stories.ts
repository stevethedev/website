import type { Meta, StoryObj } from "@storybook/react";

import IconSvg, { Icon } from "./icon-svg";

const meta = {
  title: "UI/IconSvg",
  component: IconSvg,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    icon: { control: "select", options: Object.values(Icon) },
    className: { control: "text" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IconSvg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Github: Story = {
  args: {
    icon: Icon.Github,
  },
};

export const LinkedIn: Story = {
  args: {
    icon: Icon.LinkedIn,
  },
};
