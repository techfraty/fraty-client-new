import type { AppProps } from "next/app";
import Header from "./../components/Header/index";
import { GlobalStyles } from "@/styles/global.theme";
import GlobalContextProvider from "@/context/global.context";
import AuthContextProvider from "@/context/auth.context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="App">
      <GlobalContextProvider>
        <AuthContextProvider>
          <GlobalStyles />

          <div className="appContent">
            <Header />
            <Component {...pageProps} />
          </div>
        </AuthContextProvider>
      </GlobalContextProvider>
    </div>
  );
}
