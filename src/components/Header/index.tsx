import Image from "next/image";
import { ActiveLink } from "../ActiveLink";
import { SigninButton } from "../SigninButton";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" alt="logo" layout="fill" />
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
