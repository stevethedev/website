import type { Meta, StoryObj } from "@storybook/react";

import ChevronSvg, { Direction } from ".";

const meta = {
  title: "UI/IconSvg/Chevron",
  component: ChevronSvg,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    alt: {
      description: "Alt Text",
      control: "text",
    },
    direction: {
      description: "Direction",
      control: {
        type: "select",
        options: Object.values(Direction),
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChevronSvg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: "Chevron",
    direction: Direction.Down,
  },
};
