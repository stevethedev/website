import type { Meta, StoryObj } from "@storybook/react";

import LoginForm from ".";

const meta = {
  title: "UI/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onLogin: { action: "login" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
