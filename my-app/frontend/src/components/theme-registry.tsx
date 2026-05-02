
"use client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createCustomTheme } from "@/src/themes";
export default function ThemeRegistry({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const theme = createCustomTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
