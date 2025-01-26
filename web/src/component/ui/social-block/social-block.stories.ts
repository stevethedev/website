import { Icon } from "@/component/ui/icon-svg";
import type { Meta, StoryObj } from "@storybook/react";
import SocialBlock from "./social-block";

const meta = {
  title: "UI/SocialBlock",
  component: SocialBlock,
} satisfies Meta<typeof SocialBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    links: [
      {
        to: "https://github.com/stevethedev",
        icon: Icon.Github,
      },
      {
        to: "https://linkedin.com/in.stevethedev",
        icon: Icon.LinkedIn,
      },
    ],
  },
};
