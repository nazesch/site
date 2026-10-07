import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa Tracker",
  description: "Cronograma y seguimiento de actividades de construcción",
  applicationName: "Casa Tracker",
  appleWebApp: {
    capable: true,
    title: "Casa",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={GeistSans.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
