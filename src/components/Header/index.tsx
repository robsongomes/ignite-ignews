import Link from "next/link";
import { ActiveLink } from "../ActiveLink";
import { SigninButton } from "../SigninButton";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="logo" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a className={styles.active}>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Post</a>
          </ActiveLink>
        </nav>
        <SigninButton />
      </div>
    </header>
  );
}
