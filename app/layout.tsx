import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AlphaGate | Decentralized Beta Access & On-Chain Whitelist Protocol",
  description:
    "Capped, verifiable on-chain whitelisting and beta testing wave protocol on Botchain Testnet. Protocol teams launch tester rounds; community members claim verifiable alpha passes.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-mainText min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
