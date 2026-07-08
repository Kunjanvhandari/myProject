import { Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ThemeRegistry from "./ThemeRegistry";
import ToastNotifications from "./components/ToastNotifications";

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
            <NotificationProvider>
              {children}
              <ToastNotifications />
            </NotificationProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
