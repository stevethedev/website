import type { Meta, StoryObj } from "@storybook/react";

import Markdown from ".";

const meta = {
  title: "UI/Markdown",
  component: Markdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: `
# Markdown

This is a markdown component. It renders markdown text as HTML.

## Features

- Renders markdown text as HTML

## Usage

\`\`\`tsx
import Markdown from "@/component/ui/markdown";

export default function MyComponent() {
    return (
        <Markdown>
            # Hello, world!
        </Markdown>
    );       
}

\`\`\`
    `,
  },
};
