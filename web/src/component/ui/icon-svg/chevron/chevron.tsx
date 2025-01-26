import BaseSvg, { type SvgIconProps } from "@/component/ui/icon-svg/base";
import type { ReactElement } from "react";
import styles from "./chevron.module.css";

export interface ChevronSvgProps extends SvgIconProps {
  readonly direction: Direction;
}

export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

export default function ChevronSvg({
  className,
  direction,
  alt = "",
  ...rest
}: ChevronSvgProps): ReactElement {
  return (
    <BaseSvg
      viewBox="0 0 24 24"
      className={[styles.chevron, styles[direction], className]}
      alt={alt}
      fill="none"
      {...rest}
    >
      <path
        d="M7 10l5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseSvg>
  );
}
