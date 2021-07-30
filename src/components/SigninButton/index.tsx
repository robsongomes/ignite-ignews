import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useSession, signIn, signOut } from "next-auth/client";
import styles from "./styles.module.scss";

export function SigninButton() {
  const [session, loading] = useSession();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return session ? (
    <button className={styles.signinButton}>
      <FaGithub color="#04d361" />
      Robson
      <FiX onClick={() => signOut()} color="#737380" title="Sair" />
    </button>
  ) : (
    <button onClick={() => signIn("github")} className={styles.signinButton}>
      <FaGithub color="#eba417" />
      Signin with Github
    </button>
  );
}
