import type { Meta, StoryObj } from "@storybook/react";
import Input from ".";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    setValue: { action: "set-value" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Input label",
    name: "input-name",
    value: "input-value",
  },
};
