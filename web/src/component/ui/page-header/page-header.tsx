import { Icon } from "@/component/ui/icon-svg";
import Logo from "@/component/ui/logo";
import SocialBlock, { type LinkDefinition } from "@/component/ui/social-block";
import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement } from "react";
import { Link } from "react-router";
import styles from "./page-header.module.css";

export interface PageHeaderProps {
  readonly className?: ClassName;
}

export default function PageHeader({
  className,
}: PageHeaderProps): ReactElement {
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

  return (
    <header className={getClassName(styles["page-header"], className)}>
      <section className={styles["page-header-title"]}>
        <h1>
          <Link to="/">
            <Logo className={styles.logo} />
          </Link>
        </h1>
        <span>Software Engineer | Software Architect</span>
      </section>
      <SocialBlock links={links} />
    </header>
  );
}
