import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "HireEgypt — Find Your Next Job",
  description: "The modern job board for Egypt's tech industry",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className={`${geist.variable} font-sans bg-gray-50 text-gray-900 antialiased`}>
      <Providers>{children}</Providers>
      </body>
      </html>
  );
}