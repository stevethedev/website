import BaseLayout from "@/component/layout/base";
import PageHeader from "@/component/ui/page-header";
import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement } from "react";
import styles from "./two-column.module.css";

export interface TwoColumnLayoutProps {
  readonly className?: ClassName;
}

export default function TwoColumnLayout({
  className,
}: TwoColumnLayoutProps): ReactElement {
  return (
    <BaseLayout className={getClassName(styles["two-column"], className)}>
      <PageHeader className={styles["header"]} />
      <nav>page nav</nav>
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
