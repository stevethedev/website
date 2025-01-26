import type { Meta, StoryObj } from "@storybook/react";

import Article from ".";

const meta = {
  title: "UI/Article",
  component: Article,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Article>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is an article.",
  },
};
