// File: app/layout.tsx
import { DM_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { Header } from "@/components/landingpage/Header";
import "./globals.css";
import RootClient from './RootClient'; 

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Metadata for the page
export const metadata = {
  title: "Cavite Venture",
  description: "Template created by Frontend Tribe",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={twMerge(dmSans.className, "antialiased bg-[#EAEFEF] text-gray-900")}>
        <Header />
        <RootClient>{children}</RootClient>
      </body>
    </html>
  );
};

export default RootLayout;
