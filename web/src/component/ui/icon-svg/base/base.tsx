import type { ClassName } from "@/utils/class-name";
import getClassName from "@/utils/class-name";
import type { ReactElement, ReactNode, SVGProps } from "react";
import styles from "./base.module.css";

export type SvgIconProps = Readonly<Partial<Omit<BaseSvgProps, "children">>>;

export interface BaseSvgProps
  extends Omit<SVGProps<SVGSVGElement>, "className"> {
  readonly className?: ClassName;
  readonly alt?: string;
  readonly children?: ReactNode;
  readonly size?: number;
}

export default function BaseSvg({
  className,
  alt,
  children,
  size = 2,
  style,
  ...rest
}: BaseSvgProps): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={getClassName(styles.base, className)}
      role="graphics-symbol"
      aria-label={alt ?? ""}
      aria-hidden={(alt ?? "") === ""}
      style={{ ...style, "--icon-size": `${size}rem` }}
      {...rest}
    >
      {children}
    </svg>
  );
}
