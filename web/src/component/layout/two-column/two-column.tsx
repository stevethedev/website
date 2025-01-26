import BaseLayout from "@/component/layout/base";
import { Icon } from "@/component/ui/icon-svg";
import type { LinkElement } from "@/component/ui/main-nav";
import MainNav from "@/component/ui/main-nav";
import PageHeader from "@/component/ui/page-header";
import type { LinkDefinition } from "@/component/ui/social-block";
import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement } from "react";
import styles from "./two-column.module.css";

export interface TwoColumnLayoutProps {
  readonly className?: ClassName;
}

export default function TwoColumnLayout({
  className,
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
      <PageHeader className={styles["header"]} links={links} />
      <MainNav className={styles["nav"]} linkTree={linkTree} />
      <section>
        <main>Page content</main>
        <aside>
          <div>Aside 1</div>
          <div>Aside 2</div>
        </aside>
      </section>
      <footer>Page footer</footer>
    </BaseLayout>
  );
}
