import { Html, Head, Main, NextScript } from "next/document";
import { GlobalStyles } from "../styles/global.theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <meta
          name="description"
          content="Planning parties made simple and delightful for all the smexy people out their."
        />
        <meta
          property="og:title"
          content="Heyyoo, You have been invited to party on Fraty!"
        />
        <meta property="og:image" content="https://fraty.in/thumbnail.jpeg" />

        <meta
          property="og:description"
          content="Planning parties made simple and delightful for all the smexy people out their."
        />
        <meta property="og:url" content="https://fraty.in" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />
        <meta property="og:type" content="website" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fraty.in/" />
        <meta
          property="twitter:title"
          content="Heyyoo, You have been invited to party on Fraty!"
        />
        <meta
          property="twitter:description"
          content="Planning parties made simple and delightful for all the smexy people out their."
        />
        <meta
          property="twitter:image"
          content="https://fraty.in/thumbnail.jpeg"
        /> */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <GlobalStyles />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
