import type { Meta, StoryObj } from "@storybook/react";

import Component from "./main-nav";

const meta = {
  title: "UI/MainNav",
  component: Component,
  parameters: {
    layout: "centered",
  },
  args: {
    linkTree: [
      { label: "Home", to: "/" },
      {
        label: "Blog",
        to: "/blog",
        subLinks: [
          { label: "Computer Science", to: "/blog/computer-science" },
          { label: "Programming", to: "/blog/programming" },
          { label: "Site Updates", to: "/blog/site-updates" },
          { label: "Software Engineering", to: "/blog/software-engineering" },
        ],
      },
      { label: "About", to: "/about" },
    ],
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
