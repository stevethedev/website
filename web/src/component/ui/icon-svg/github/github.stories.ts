import type { Meta, StoryObj } from "@storybook/react";

import GitHubSvg from ".";

const meta = {
  title: "UI/IconSvg/GitHub",
  component: GitHubSvg,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    alt: {
      description: "Alt Text",
      control: "text",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GitHubSvg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
