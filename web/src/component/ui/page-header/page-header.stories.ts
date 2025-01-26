import { Icon } from "@/component/ui/icon-svg";
import type { Meta, StoryObj } from "@storybook/react";

import PageHeader from "./page-header";

const meta = {
  title: "UI/PageHeader",
  component: PageHeader,
  args: {
    links: [
      {
        to: "https://www.linkedin.com/in/stevenmjimenez",
        target: "_blank",
        rel: "noreferrer",
        icon: Icon.LinkedIn,
      },
      {
        to: "https://github.com/stevethedev",
        target: "_blank",
        rel: "noreferrer",
        icon: Icon.Github,
      },
    ],
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
