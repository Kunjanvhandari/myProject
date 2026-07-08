import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

const baseOptions = (mode = "light") => createTheme({
  palette: {
    mode,
    primary: { main: "#1E293B", light: "#334155", dark: "#0F172A" },
    secondary: { main: "#0EA5E9", light: "#38BDF8", dark: "#0284C7" },
    background: {
      default: mode === "light" ? "#FAFAFA" : "#0A0A0F",
      paper: mode === "light" ? "#FFFFFF" : "#12121A",
    },
    text: {
      primary: mode === "light" ? "#0F172A" : "#F1F1F3",
      secondary: mode === "light" ? "#475569" : "#A1A1AA",
    },
    error: { main: "#EF4444" },
    success: { main: "#10B981" },
    info: { main: "#0EA5E9" },
    warning: { main: "#F59E0B" },
    divider: mode === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Inter', 'Poppins', sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.03em", fontSize: "clamp(2.2rem, 5vw, 3.8rem)" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" },
    h4: { fontWeight: 700, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
    button: { fontWeight: 600, letterSpacing: "0.02em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "12px",
          padding: "10px 24px",
          fontSize: "14px",
          letterSpacing: "0.3px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 60%)",
            opacity: 0,
            transition: "opacity 0.3s",
          },
          "&:hover::after": { opacity: 1 },
        },
        containedPrimary: {
          color: "#fff",
          background: "linear-gradient(135deg, #1E293B, #334155)",
          boxShadow: "0 4px 14px rgba(30, 41, 59, 0.25)",
          "&:hover": {
            background: "linear-gradient(135deg, #0F172A, #1E293B)",
            boxShadow: "0 8px 25px rgba(30, 41, 59, 0.35)",
            transform: "translateY(-2px)",
          },
        },
        containedSecondary: {
          color: "#fff",
          background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
          boxShadow: "0 4px 14px rgba(14, 165, 233, 0.35)",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(14, 165, 233, 0.45)",
            transform: "translateY(-2px)",
          },
        },
        outlinedPrimary: {
          border: "1.5px solid var(--border-color, #E5E7EB)",
          color: "var(--text-primary, #0F172A)",
          "&:hover": {
            background: "var(--bg-tertiary, #F1F5F9)",
            borderColor: "var(--primary, #1E293B)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            transform: "translateY(-4px)",
            borderColor: "rgba(14, 165, 233, 0.15)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: "16px" },
        elevation1: { boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
        elevation2: { boxShadow: "0 4px 12px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.06)" },
        elevation3: { boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.08)" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: "8px", fontWeight: 600 },
        filled: { background: "var(--bg-tertiary)" },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            background: "var(--bg-secondary)",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "var(--border-color)",
              borderWidth: "1.5px",
            },
            "&:hover fieldset": { borderColor: "var(--primary)" },
            "&.Mui-focused fieldset": {
              borderColor: "#0EA5E9",
              borderWidth: "2px",
              boxShadow: "0 0 0 3px rgba(14,165,233,0.1)",
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "20px",
          background: "var(--bg-secondary)",
          backdropFilter: "blur(20px)",
          padding: "8px",
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: "var(--border-color)" } } },
    MuiIconButton: { styleOverrides: { root: { borderRadius: "12px", transition: "all 0.2s ease" } } },
    MuiAvatar: { styleOverrides: { root: { transition: "all 0.2s ease" } } },
    MuiRating: { styleOverrides: { iconFilled: { color: "#0EA5E9" } } },
    MuiSnackbar: { styleOverrides: { root: { "& .MuiPaper-root": { borderRadius: "12px" } } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "1px solid var(--border-color)" },
        head: { fontWeight: 700, color: "var(--text-secondary)" },
      },
    },
  },
});

export const createCustomTheme = (mode = "light") => {
  let theme = createTheme(deepmerge(baseOptions(mode), {}));
  try { theme = responsiveFontSizes(theme); } catch (e) {}
  return theme;
};
