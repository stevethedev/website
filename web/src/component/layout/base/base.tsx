import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement, ReactNode } from "react";
import styles from "./base.module.css";

export interface BaseLayoutProps {
  readonly children: ReactNode;
  readonly className?: ClassName;
}

export default function BaseLayout({
  children,
  className,
}: BaseLayoutProps): ReactElement {
  return (
    <section className={getClassName(styles.base, className)}>
      {children}
    </section>
  );
}
