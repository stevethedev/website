import BaseLayout from "@/component/layout/base";
import type { LinkElement } from "@/component/ui/main-nav";
import MainNav from "@/component/ui/main-nav";
import PageHeader from "@/component/ui/page-header";
import Viewport from "@/component/ui/viewport";
import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement, ReactNode } from "react";
import styles from "./admin.module.css";

export interface AdminLayoutProps {
  readonly className?: ClassName;
  readonly children?: ReactNode;
}

export default function AdminLayout({
  className,
  children,
}: AdminLayoutProps): ReactElement {
  const linkTree: LinkElement[] = [{ label: "Pages", to: "/pages" }];
  return (
    <BaseLayout className={[styles["two-column"], className]}>
      <section
        className={getClassName(styles.container, styles["header-container"])}
      >
        <PageHeader className={styles["header"]} links={[]} />
      </section>
      <section
        className={getClassName(styles.container, styles["nav-container"])}
      >
        <MainNav className={styles["nav"]} linkTree={linkTree} />
      </section>
      <Viewport className={styles["viewport"]}>{children}</Viewport>
    </BaseLayout>
  );
}
