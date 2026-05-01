import { Inter, Pixelify_Sans } from "next/font/google";
import "./globals.css";

import NavbarWrapper from "../components/NavbarWrapper";
import { ThemeProvider } from "../components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const pixel = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Pixilog",
  description: "Your personal pixel diary",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Pixilog",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  themeColor: "#191f2b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pixel.variable} antialiased overflow-x-hidden`} suppressHydrationWarning>
        <ThemeProvider>
          <NavbarWrapper />

<main className="max-w-4xl mx-auto p-6 pb-24 md:pb-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
