import getClassName, { type ClassName } from "@/utils/class-name";
import type { ReactElement } from "react";
import css from "./logo.module.css";
import logo from "./logo.svg";

export interface LogoProps {
  readonly alt?: string;
  readonly className?: ClassName;
}

export default function Logo({
  className,
  alt = "Steve the Dev",
}: LogoProps): ReactElement {
  return (
    <img alt={alt} src={logo} className={getClassName(css.logo, className)} />
  );
}
