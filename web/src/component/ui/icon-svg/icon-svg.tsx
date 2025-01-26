import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement } from "react";
import styles from "./icon-svg.module.css";
import githubSvg from "./svg/github-mark-white.svg";
import linkedinSvg from "./svg/linkedin.svg";

export enum Icon {
  Github = "github",
  LinkedIn = "linkedin",
}

export interface Props {
  readonly icon: Icon;
  readonly iconSize?: number;
  readonly className?: ClassName;
}

const mapping: Record<Icon, string> = {
  [Icon.Github]: githubSvg,
  [Icon.LinkedIn]: linkedinSvg,
};

export default function IconSvg({
  icon,
  iconSize = 2,
  className,
}: Props): ReactElement {
  return (
    <img
      src={mapping[icon]}
      alt={icon}
      style={{ "--icon-size": `${iconSize}em` }}
      className={getClassName(styles.icon, styles[icon], className)}
    />
  );
}
