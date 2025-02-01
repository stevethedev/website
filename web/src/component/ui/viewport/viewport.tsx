import getClassName, { type ClassName } from "@/utils/class-name";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import styles from "./viewport.module.css";

export interface ViewportProps
  extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  readonly className?: ClassName;
  readonly children?: ReactNode;
}

export default function Viewport({
  className,
  children,
}: ViewportProps): ReactElement {
  return (
    <section className={getClassName(styles["viewport"], className)}>
      {children}
    </section>
  );
}
