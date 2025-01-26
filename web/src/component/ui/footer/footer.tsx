import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement } from "react";
import styles from "./footer.module.css";

export interface FooterProperties {
  className?: ClassName;
}

export default function Footer({ className }: FooterProperties): ReactElement {
  const now = new Date();
  const year = now.getFullYear();
  return (
    <footer className={getClassName(styles.footer, className)}>
      Copyright &copy; 2017&ndash;{year} Steven Jimenez. All Rights Reserved.
    </footer>
  );
}
