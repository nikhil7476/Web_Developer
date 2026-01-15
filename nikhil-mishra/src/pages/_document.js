import { Html, Head, Main, NextScript } from "next/document";

/* =====================
   Custom Document
====================== */
export default function Document() {
  return (
    <Html lang="en">
      {/* =====================
          Head
      ====================== */}
      <Head />

      {/* =====================
          Body
      ====================== */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
