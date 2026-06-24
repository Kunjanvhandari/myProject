import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { themeOptions } from "../themes/typography";
import { deepmerge } from "@mui/utils";

const baseOptions = createTheme({
  palette: {
    primary: {
      main: "#1E293B",
      light: "#334155",
      dark: "#0F172A",
    },
    secondary: {
      main: "#0EA5E9",
      light: "#38BDF8",
      dark: "#0284C7",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
    error: {
      main: "#EF4444",
    },
    success: {
      main: "#10B981",
    },
    info: {
      main: "#0EA5E9",
    },
    warning: {
      main: "#F59E0B",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Inter', 'Poppins', sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: "0.02em" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: "smooth",
        },
      },
    },
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
        },
        containedPrimary: {
          color: "#fff",
          background: "#1E293B",
          boxShadow: "0 4px 14px rgba(30, 41, 59, 0.25)",
          "&:hover": {
            background: "#0F172A",
            boxShadow: "0 6px 20px rgba(30, 41, 59, 0.35)",
            transform: "translateY(-2px)",
          },
        },
        containedSecondary: {
          color: "#fff",
          background: "#0EA5E9",
          boxShadow: "0 4px 14px rgba(14, 165, 233, 0.35)",
          "&:hover": {
            background: "#0284C7",
            boxShadow: "0 6px 20px rgba(14, 165, 233, 0.45)",
            transform: "translateY(-2px)",
          },
        },
        outlinedPrimary: {
          border: "2px solid #1E293B",
          color: "#1E293B",
          "&:hover": {
            background: "#1E293B",
            color: "#fff",
            border: "2px solid #1E293B",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 14px rgba(30, 41, 59, 0.2)",
          },
        },
        outlinedSecondary: {
          border: "2px solid #0EA5E9",
          color: "#0EA5E9",
          "&:hover": {
            background: "#0EA5E9",
            color: "#fff",
            border: "2px solid #0EA5E9",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.08)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "& fieldset": {
              borderColor: "#E5E7EB",
              borderWidth: "1.5px",
            },
            "&:hover fieldset": {
              borderColor: "#1E293B",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1E293B",
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
        elevation1: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.06)",
        },
        elevation3: {
          boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "20px",
          padding: "8px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0,0,0,0.06)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          transition: "all 0.2s ease",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid transparent",
          transition: "all 0.2s ease",
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: "#0EA5E9",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiPaper-root": {
            borderRadius: "12px",
          },
        },
      },
    },
  },
});

export const createCustomTheme = () => {
  let theme = createTheme(deepmerge(baseOptions, themeOptions));
  try {
    theme = responsiveFontSizes(theme);
  } catch (e) {}
  return theme;
};
