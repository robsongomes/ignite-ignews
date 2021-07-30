import { AppProps } from "next/app";
import { Provider as GithubProvider } from "next-auth/client";
import { Header } from "../components/Header";
import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GithubProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </GithubProvider>
  );
}

export default MyApp;
