import type { Meta, StoryObj } from "@storybook/react";

import LinkedInSvg from ".";

const meta = {
  title: "UI/IconSvg/LinkedIn",
  component: LinkedInSvg,
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
} satisfies Meta<typeof LinkedInSvg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
