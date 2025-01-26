import type { ReactElement } from "react";
import css from "./logo.module.css";
import logo from "./logo.svg";
import getClassName, { type ClassName } from "@/utils/class-name";

export interface Props {
  readonly alt?: string;
  readonly className?: ClassName;
}
export default function Logo({
  className,
  alt = "Steve the Dev",
}: Props): ReactElement {
  console.log(css);
  return (
    <img alt={alt} src={logo} className={getClassName(css.logo, className)} />
  );
}
