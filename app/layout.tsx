import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import Head from 'next/head';

export const metadata = {
  metadataBase: new URL('https://knoat.com'),
  title: 'Knoat | Home',
  description: 'Note App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={'h-[100vh] ' + GeistSans.className}
      suppressHydrationWarning
    >
      <Head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Knoat" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Knoat</title>
        <meta
          name="description"
          content="Note app for mobile, desktop, and offline"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://knoat.com" />
        <meta name="twitter:title" content="Knoat" />
        <meta
          name="twitter:description"
          content="Note app for mobile, desktop, and offline"
        />
        <meta name="twitter:image" content="/icons/twitter.png" />
        <meta name="twitter:creator" content="@JustinFormentin" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Knoat" />
        <meta
          property="og:description"
          content="Note app for mobile, desktop, and offline"
        />
        <meta property="og:site_name" content="Knoat" />
        <meta property="og:url" content="https://knoat.com" />
        <meta property="og:image" content="/icons/og.png" />
      </Head>
      <body className="bg-background text-foreground md:overflow-hidden h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen h-full flex flex-col items-center">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
