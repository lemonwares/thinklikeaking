import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const germania = localFont({
  src: "../../public/fonts/Boska-Regular.otf",
  variable: "--font-germania",
  weight: "300",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Think Like a King",
  description:
    "Think Like a King — a book that challenges you to elevate your mindset, lead with purpose, and live with the conviction of royalty.",
  keywords: [
    "think like a king",
    "mindset",
    "leadership",
    "self-development",
    "book",
  ],
  icons: {
    icon: "/book.webp",
  },
  openGraph: {
    title: "Think Like a King",
    description:
      "Think Like a King — a book that challenges you to elevate your mindset, lead with purpose, and live with the conviction of royalty.",
    images: [
      {
        url: "/book.webp",
        width: 1200,
        height: 630,
        alt: "Think Like a King — Book Cover",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Think Like a King",
    description:
      "Think Like a King — a book that challenges you to elevate your mindset, lead with purpose, and live with the conviction of royalty.",
    images: ["/book.webp"],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  userScalable: false,
  height: "device-height",
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${germania.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="w-[90%] max-w-6xl mx-auto flex flex-col flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
