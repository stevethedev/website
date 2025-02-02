import type { Meta, StoryObj } from "@storybook/react";
import Button, { Variant } from ".";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onClick: { action: "click" },
    variant: {
      control: {
        type: "radio",
        options: ["<none>", "primary", "subdued"],
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
    variant: Variant.Primary,
  },
};

export const Subdued: Story = {
  args: {
    children: "Button",
    variant: Variant.Subdued,
  },
};
