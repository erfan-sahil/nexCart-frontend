import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";

import { QueryProvider } from "@/components/providers/query-provider";
import { RootHeadScripts } from "@/components/providers/root-head-scripts";
import { AuthProvider } from "@/features/auth/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getSiteUrl, siteConfig } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteUrl,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteUrl,
  logo: `${siteUrl}${siteConfig.logoPath}`,
  description: siteConfig.description,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.logoPath,
        alt: `${siteConfig.name} — fast shopping marketplace`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.logoPath],
  },
  icons: {
    icon: [{ url: siteConfig.faviconPath, type: "image/png" }],
    apple: [{ url: siteConfig.faviconPath, type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const rootJsonLd = JSON.stringify([websiteJsonLd, organizationJsonLd]);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <RootHeadScripts jsonLd={rootJsonLd} />
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
