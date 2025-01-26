import ChevronSvg, { Direction } from "@/component/ui/icon-svg/chevron";
import type { ClassName } from "@/utils/class-name";
import getClassName from "@/utils/class-name";
import type { ReactElement } from "react";
import type { NavLinkProps } from "react-router";
import { NavLink } from "react-router";
import styles from "./main-nav.module.css";

export interface MainNavProps {
  readonly className?: ClassName;
  readonly linkTree: LinkElement[];
}

export interface LinkElement extends Exclude<NavLinkProps, "children"> {
  readonly label: string;
  readonly subLinks?: Exclude<LinkElement, "subLinks">[];
}

export default function MainNav({
  className,
  linkTree,
}: MainNavProps): ReactElement {
  return (
    <nav
      role="navigation"
      className={getClassName(styles["main-nav"], className)}
    >
      <LinkTreeRenderer className={styles["main-nav-ul"]} linkTree={linkTree} />
    </nav>
  );
}

interface LinkTreeRendererProperties {
  readonly linkTree: ReadonlyArray<LinkElement>;
  readonly className?: ClassName;
}
function LinkTreeRenderer({
  linkTree,
  className,
}: LinkTreeRendererProperties): ReactElement {
  return (
    <ul className={getClassName(className)}>
      {linkTree?.map(({ label, to, subLinks }) => (
        <li key={JSON.stringify(to)}>
          <NavLink to={to}>
            {label}
            {subLinks && (
              <ChevronSvg className={styles.icon} direction={Direction.Down} />
            )}
          </NavLink>
          {subLinks && <LinkTreeRenderer linkTree={subLinks} />}
        </li>
      ))}
    </ul>
  );
}
