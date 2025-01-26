import { Link, type LinkProps } from "react-router";
import IconSvg, { Icon } from "@/component/ui/icon-svg/icon-svg";
import styles from "./social-block.module.css";
import getClassName, { type ClassName } from "@/utils/class-name";

export interface SocialBlockProperties {
  readonly className?: ClassName;
  readonly links: LinkDefinition[];
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
      {links.map(({ to, target, rel, icon }) => (
        <Link key={JSON.stringify(to)} to={to} target={target} rel={rel}>
          <IconSvg className={styles["social-block-link"]} icon={icon} />
        </Link>
      ))}
    </section>
  );
}
