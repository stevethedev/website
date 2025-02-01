import getClassName, { type ClassName } from "@/utils/class-name";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { renderToString } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import styles from "./markdown.module.css";

export interface ArticleProps
  extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  readonly children?: ReactNode;
  readonly className?: ClassName;
}

export default function Markdown({
  children,
  className,
}: ArticleProps): ReactElement {
  return (
    <ReactMarkdown className={getClassName(styles.markdown, className)}>
      {renderToString(children)}
    </ReactMarkdown>
  );
}
