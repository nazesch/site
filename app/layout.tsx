import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa Tracker",
  description: "Cronograma y seguimiento de actividades de construcción",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={GeistSans.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
