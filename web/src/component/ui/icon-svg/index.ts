import type { ComponentType } from "react";

import Github from "./github";
import LinkedIn from "./linkedin";

export enum Icon {
  Github = "github",
  LinkedIn = "linkedin",
}

export default {
  [Icon.Github]: Github,
  [Icon.LinkedIn]: LinkedIn,
} satisfies Record<Icon, ComponentType>;
