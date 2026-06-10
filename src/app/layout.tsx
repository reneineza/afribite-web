import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AfriBite | Authentic African Flavors in Canada",
  description: "Your premier destination for authentic African groceries, spices, snacks, and specialty ingredients in Canada. Shop premium jollof, crayfish, and more.",
  keywords: ["African grocery Canada", "African food online", "Nigerian spices", "African market", "Jollof rice ingredients"],
  openGraph: {
    title: "AfriBite - Authentic African Flavors",
    description: "Your premier destination for authentic African groceries in Canada.",
    url: "https://afribite.ca",
    siteName: "AfriBite",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PLACEHOLDER');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
