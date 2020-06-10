import Head from "next/head";

export default function Meta() {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="description" content="Description" />
      <meta name="keywords" content="Keywords" />
      <link rel="manifest" href="/manifest.json" />
      <link
        href="icons/favicon-16x16.png"
        rel="icon"
        type="image/png"
        sizes="16x16"
      />
      <link
        href="icons/favicon-32x32.png"
        rel="icon"
        type="image/png"
        sizes="32x32"
      />
      <link
        href="icons/favicon-192x192.png"
        rel="icon"
        type="image/png"
        sizes="192x192"
      />
      <link
        href="icons/favicon-512x512.png"
        rel="icon"
        type="image/png"
        sizes="512x512"
      />
      <link rel="apple-touch-icon" href="icons/apple-icon.png"></link>
      <meta name="theme-color" content="#317EFB" />
    </Head>
  );
}
