import type { ReactElement } from "react";
import css from "./logo.module.css";
import logo from "./logo.svg";

export interface Props {
  readonly alt?: string;
}
export default function Logo({ alt = "Steve the Dev" }: Props): ReactElement {
  console.log(css);
  return <img alt={alt} src={logo} className={css.logo} />;
}
