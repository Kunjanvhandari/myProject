"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createCustomTheme } from "@/src/themes";

export const ThemeModeContext = createContext({ mode: "light", toggleMode: () => {} });
export const useThemeMode = () => useContext(ThemeModeContext);

export default function ThemeRegistry({ children }) {
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme-mode");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setMode("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme-mode", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  };

  const theme = createCustomTheme(mode);

  if (!mounted) return <>{children}</>;

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
