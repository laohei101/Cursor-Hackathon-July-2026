import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expecta — Is it safe? Know at the shelf.",
  description:
    "Scan any product's barcode or label and get an instant, evidence-based pregnancy and breastfeeding safety verdict — with the reasoning behind it.",
};

export const viewport: Viewport = {
  themeColor: "#e64980",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full">
        <div className="mx-auto flex min-h-full max-w-md flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
