import BaseLayout from "@/component/layout/base";
import Article from "@/component/ui/article";
import Footer from "@/component/ui/footer";
import { Icon } from "@/component/ui/icon-svg";
import type { LinkElement } from "@/component/ui/main-nav";
import MainNav from "@/component/ui/main-nav";
import PageHeader from "@/component/ui/page-header";
import type { LinkDefinition } from "@/component/ui/social-block";
import Viewport from "@/component/ui/viewport";
import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement } from "react";
import styles from "./two-column.module.css";

export interface TwoColumnLayoutProps {
  readonly className?: ClassName;
  readonly children?: ReactElement;
}

export default function TwoColumnLayout({
  className,
  children,
}: TwoColumnLayoutProps): ReactElement {
  const links: LinkDefinition[] = [
    {
      to: "https://www.linkedin.com/in/stevenmjimenez",
      target: "_blank",
      rel: "noreferrer",
      icon: Icon.LinkedIn,
    },
    {
      to: "https://github.com/stevethedev",
      target: "_blank",
      rel: "noreferrer",
      icon: Icon.Github,
    },
  ];

  const linkTree: LinkElement[] = [
    { label: "Home", to: "/" },
    {
      label: "Blog",
      to: "/blog",
      subLinks: [
        { label: "Computer Science", to: "/blog/computer-science" },
        { label: "Programming", to: "/blog/programming" },
        { label: "Site Updates", to: "/blog/site-updates" },
        { label: "Software Engineering", to: "/blog/software-engineering" },
      ],
    },
    { label: "About", to: "/about" },
  ];
  return (
    <BaseLayout className={getClassName(styles["two-column"], className)}>
      <section
        className={getClassName(styles.container, styles["header-container"])}
      >
        <PageHeader className={styles["header"]} links={links} />
      </section>
      <section
        className={getClassName(styles.container, styles["nav-container"])}
      >
        <MainNav className={styles["nav"]} linkTree={linkTree} />
      </section>
      <Viewport className={styles["viewport"]}>
        <main className={styles.column}>{children}</main>
        <aside className={styles.column}>
          <Article>Aside 1</Article>
          <Article>Aside 2</Article>
        </aside>
      </Viewport>
      <Footer className={styles.footer} />
    </BaseLayout>
  );
}
