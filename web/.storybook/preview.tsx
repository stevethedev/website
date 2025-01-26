import type { Preview } from "@storybook/react";
import { BrowserRouter } from "react-router";

import "@/styles/core/index.module.css";

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  applyDecorators: (storyFn) => (storyContext) => (
    <BrowserRouter>{storyFn(storyContext)}</BrowserRouter>
  ),
} satisfies Preview;
