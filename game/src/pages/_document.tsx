import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render = () => {
    return (
      <Html lang="nb">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo.png" />

          <meta property="og:title" content="Earth Doom - www.earthdoom.com" />
          <meta name="author" content="Daniel" />
          <meta property="og:locale" content="nb_NO" />
          <meta name="description" content="Earth Doom - www.earthdoom.com" />
          <meta
            property="og:description"
            content="Earth Doom - www.earthdoom.com"
          />

          <meta property="og:url" content="https://www.earthdoom.com" />
          <meta property="og:site_name" content="earthdoom.com" />
        </Head>
        <body className="font-body bg-neutral-900 mb-24">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  };
}

export default MyDocument;
