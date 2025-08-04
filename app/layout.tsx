import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CV Builder - Créez votre CV professionnel en ligne",
  description: "Créez facilement un CV professionnel et moderne avec notre générateur de CV en ligne. Interface intuitive, thèmes personnalisables, téléchargement PDF instantané.",
  keywords: ["CV", "Curriculum Vitae", "CV Builder", "Générateur CV", "CV en ligne", "CV professionnel"],
  authors: [{ name: "CV Builder" }],
  creator: "CV Builder",
  publisher: "CV Builder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "CV Builder - Créez votre CV professionnel en ligne",
    description: "Créez facilement un CV professionnel et moderne avec notre générateur de CV en ligne. Interface intuitive, thèmes personnalisables, téléchargement PDF instantané.",
    url: "/",
    siteName: "CV Builder",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "CV Builder - Générateur de CV professionnel",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Builder - Créez votre CV professionnel en ligne",
    description: "Créez facilement un CV professionnel et moderne avec notre générateur de CV en ligne. Interface intuitive, thèmes personnalisables, téléchargement PDF instantané.",
    images: ["/og-image"],
    creator: "@cvbuilder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="sunset">
      <head>
        {/* Additional meta tags for better social sharing */}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:site" content="@cvbuilder" />
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
