import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import "../src/scss/main.scss";
import 'animate.css';
import ThemeRegistry from "@/src/components/theme-registry";
import AuthGuard from "@/src/components/client-guard";
import ContextWrapper from "@/src/context/ContextWrapper";
import { AuthProvider } from "@/context/AuthContext";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LibriVista - Digital Library Management System",
  description: "Explore 50,000+ physical books and 100,000+ digital resources. Your gateway to knowledge - borrow, read, and discover with LibriVista Library Management System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${poppins.variable} antialiased`}
      >
        <ThemeRegistry>
          <AuthProvider>
            <ContextWrapper>
              {children}
            </ContextWrapper>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
