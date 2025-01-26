import getClassName, { type ClassName } from "@/utils/class-name";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import styles from "./article.module.css";

export interface ArticleProps
  extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  readonly children?: ReactNode;
  readonly className?: ClassName;
}

export default function Article({
  children,
  className,
}: ArticleProps): ReactElement {
  return (
    <article className={getClassName(styles.article, className)}>
      {children}
    </article>
  );
}
