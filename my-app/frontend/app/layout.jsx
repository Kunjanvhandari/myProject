import { Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ThemeRegistry from "./ThemeRegistry";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins" });

export const metadata = {
  title: "LibriVista - Digital Library",
  description: "Library management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${poppins.variable}`}>
      <body>
        <ThemeRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
