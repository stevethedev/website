import BaseLayout from "@/component/layout/base";
import Viewport from "@/component/ui/viewport";
import { type ClassName } from "@/utils/class-name";
import type { ReactElement } from "react";
import styles from "./login.module.css";

export interface LoginLayoutProps {
  readonly className?: ClassName;
  readonly children?: ReactElement;
}

export default function LoginLayout({
  className,
  children,
}: LoginLayoutProps): ReactElement {
  return (
    <BaseLayout className={[styles["login"], className]}>
      <Viewport className={styles.viewport}>{children}</Viewport>
    </BaseLayout>
  );
}
