import type { AppProps } from "next/app";
import Header from "./../components/Header/index";
import { GlobalStyles } from "@/styles/global.theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="App">
      <GlobalStyles />
      <Header />
      <div className="appContent">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
