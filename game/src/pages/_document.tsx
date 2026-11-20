import Document, { Html, Head, Main, NextScript } from "next/document";

import type { DocumentContext } from "next/document";

/**
 * This is a React class that extends the Document class and sets some initial props for server-side rendering.
 * It also sets some meta tags for SEO and renders the Main component along with the NextScript component.
 */
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render = () => {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo.png" />
          <meta name="theme-color" content="#0a0f16" />

          <meta property="og:title" content="Earth Doom - www.earthdoom.com" />
          <meta name="author" content="Daniel" />
          <meta property="og:locale" content="en_US" />
          <meta name="description" content="Earth Doom - www.earthdoom.com" />
          <meta
            property="og:description"
            content="Earth Doom - www.earthdoom.com"
          />

          <meta property="og:url" content="https://www.earthdoom.com" />
          <meta property="og:site_name" content="earthdoom.com" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  };
}

export default MyDocument;
