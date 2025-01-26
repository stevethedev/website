import { Link } from "react-router";
import Logo from "@/component/ui/logo/logo";
import styles from "./page-header.module.css";
import { Icon } from "@/component/ui/icon-svg/icon-svg";
import SocialBlock, {
  LinkDefinition,
} from "@/component/ui/social-block/social-block";

export default function PageHeader() {
  const links: LinkDefinition[] = [
    {
      to: "https://www.linkedin.com/in/stevenmjimenez",
      target: "_blank",
      rel: "noreferrer",
      icon: Icon.LinkedIn,
    },
    {
      to: "https://github.com/stevethedev",
      target: "_blank",
      rel: "noreferrer",
      icon: Icon.Github,
    },
  ];

  return (
    <header className={styles["page-header"]}>
      <section className={styles["page-header-title"]}>
        <h1>
          <Link to="/">
            <Logo className={styles.logo} />
          </Link>
        </h1>
        <span>Software Engineer | Software Architect</span>
      </section>
      <SocialBlock links={links} />
    </header>
  );
}
