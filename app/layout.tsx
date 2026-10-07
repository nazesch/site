import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa Tracker",
  description: "Cronograma y seguimiento de actividades de construcción",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
