import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WalletProvider from '@/components/Providers/WalletProviderWrapper'
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tokenizer",
  description: "A token launchpad webapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <div
            className="min-h-screen w-full bg-gradient-to-b from-[#4a9b7f] to-[#0a3431] flex justify-center flex-row"
          >
            <div className="container m-2">
              <Navbar />

              {children}

              <Footer/>
            </div>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
