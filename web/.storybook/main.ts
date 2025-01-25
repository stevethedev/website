import type { StorybookConfig } from "@storybook/react-vite";
import "@storybook/addon-a11y";
import "@storybook/addon-essentials";
import "@storybook/addon-interactions";
import "@storybook/addon-onboarding";
import "@storybook/blocks";
import "@chromatic-com/storybook";

export default {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
} satisfies StorybookConfig;
