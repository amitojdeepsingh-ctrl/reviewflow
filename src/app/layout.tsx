import type { Metadata } from "next";
import { Inter, Fira_Code, Fira_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });
const firaSans = Fira_Sans({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans" 
});

export const metadata: Metadata = {
  title: "ReviewManager - Get More 5-Star Reviews",
  description: "The simplest way to get more 5-star reviews for your local business.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${firaCode.variable} ${firaSans.variable}`}>
        {children}
      </body>
    </html>
  );
}