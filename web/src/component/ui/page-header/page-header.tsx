import Logo from "@/component/ui/logo";
import SocialBlock, { type LinkDefinition } from "@/component/ui/social-block";
import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement } from "react";
import { Link } from "react-router";
import styles from "./page-header.module.css";

export interface PageHeaderProps {
  readonly className?: ClassName;
  readonly links: ReadonlyArray<LinkDefinition>;
}

export default function PageHeader({
  className,
  links,
}: PageHeaderProps): ReactElement {
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
