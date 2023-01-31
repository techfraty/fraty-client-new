import type { AppProps } from "next/app";
import Header from "./../components/Header/index";
import { GlobalStyles } from "@/styles/global.theme";
import GlobalContextProvider from "@/context/global.context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="App">
      <GlobalContextProvider>
        <GlobalStyles />
        <Header />
        <div className="appContent">
          <Component {...pageProps} />
        </div>
      </GlobalContextProvider>
    </div>
  );
}
