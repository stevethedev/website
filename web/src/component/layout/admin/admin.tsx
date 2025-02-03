import BaseLayout from "@/component/layout/base";
import { useAuth } from "@/component/provider/auth-provider";
import type { LinkElement } from "@/component/ui/main-nav";
import MainNav from "@/component/ui/main-nav";
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
  const { user } = useAuth();
  const displayName = user?.displayName ?? "User";

  const linkTree: LinkElement[] = [
    { label: "Dashboard", to: "/" },
    { label: "Pages", to: "/pages" },
  ];
  const userLinkTree: LinkElement[] = [
    {
      label: displayName,
      to: "/profile",
      subLinks: [{ label: "Logout", to: "/logout" }],
    },
  ];
  return (
    <BaseLayout className={[styles["two-column"], className]}>
      <section
        className={getClassName(styles.container, styles["nav-container"])}
      >
        <MainNav className={styles["nav"]} linkTree={linkTree} />
        <MainNav className={styles["nav"]} linkTree={userLinkTree} />
      </section>
      <Viewport className={styles["viewport"]}>{children}</Viewport>
    </BaseLayout>
  );
}
