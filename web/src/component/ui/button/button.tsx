import getClassName, { type ClassName } from "@/utils/class-name";
import type { HTMLAttributes, ReactElement } from "react";
import styles from "./button.module.css";

export enum Variant {
  Primary = "primary",
  Subdued = "subdued",
}

export interface ButtonProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "className"> {
  readonly className?: ClassName;
  readonly variant?: Variant;
  readonly type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  className,
  variant,
  ...props
}: ButtonProps): ReactElement {
  return (
    <button
      {...props}
      className={getClassName(
        styles.button,
        variant && styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
