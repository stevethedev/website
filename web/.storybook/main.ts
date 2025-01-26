import type { StorybookConfig } from "@storybook/react-vite";
import "@storybook/addon-a11y";
import "@storybook/addon-essentials";
import "@storybook/addon-interactions";
import "@storybook/addon-onboarding";
import "@storybook/blocks";
import "@chromatic-com/storybook";
import { dirname, resolve } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

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
  viteFinal: async (config) => ({
    ...config,
    plugins: [
      ...config.plugins,
      tsconfigPaths({
        projects: [resolve(dirname(__dirname), "tsconfig.json")],
      }),
    ],
  }),
} satisfies StorybookConfig;
