import IconSvg, { type Icon } from "@/component/ui/icon-svg";
import getClassName, { type ClassName } from "@/utils/class-name";
import { Link, type LinkProps } from "react-router";
import styles from "./social-block.module.css";

export interface SocialBlockProperties {
  readonly className?: ClassName;
  readonly links: ReadonlyArray<LinkDefinition>;
}

export interface LinkDefinition extends LinkProps {
  icon: Icon;
}

export default function SocialBlock({
  className,
  links,
}: SocialBlockProperties) {
  return (
    <section className={getClassName(styles["social-block"], className)}>
      {links?.map(({ to, target, rel, icon }) => {
        const Icon = IconSvg[icon];

        return (
          <Link key={JSON.stringify(to)} to={to} target={target} rel={rel}>
            <Icon className={styles["social-block-link"]} />
          </Link>
        );
      })}
    </section>
  );
}
