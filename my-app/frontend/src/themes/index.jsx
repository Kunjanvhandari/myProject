import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { themeOptions } from "../themes/typography";
import { deepmerge } from "@mui/utils";

const baseOptions = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#333333",
      dark: "#000000",
    },
    secondary: {
      main: "#F5F5F5",
      light: "#FAFAFA",
      dark: "#E0E0E0",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
  },
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.1) !important",
        },
        bar: {
          backgroundColor: "#000000 !important",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {},
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: "320px",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E0E0E0",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: "#000000",
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          background: "#FFFFFF !important",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          "&:last-child": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: "20px",
          padding: "10px",
          width: "40px",
          height: "40px",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#000000",
          "&.Mui-selected": {
            borderRadius: "8px",
            border: "2px solid #000000",
            backgroundColor: "#000000",
            color: "#FFFFFF !important",
            fontWeight: 600,
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#333333",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        body: {
          color: "#000000",
          fontSize: "14px",
          fontWeight: "400",
          textAlign: "center",
        },
        root: {
          borderBottom: "1px solid #E0E0E0",
          color: "#000000",
          fontSize: "14px",
        },
        head: {
          padding: "16px 16px",
          fontWeight: "600",
          background: "#000000",
          color: "#FFFFFF",
          fontSize: "14px",
          textAlign: "center",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { color: "#333333" },
        colorSecondary: {
          "&.Mui-focused": {
            color: "#000000",
          },
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          color: "#000000",
          fontSize: "14px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "1px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          position: "relative",
          fontSize: "14px",
          fontWeight: "400",
          padding: "14px 14px",
          borderRadius: "8px",
          color: "#000000",
        },
        root: {
          borderRadius: "8px",
          color: "#000000",
        },
        notchedOutline: {
          borderColor: "#E0E0E0 !important",
          "&:hover": {
            borderColor: "#000000 !important",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          padding: "20px",
          width: "100%",
          borderColor: "#E0E0E0",
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          borderRadius: "12px",
          padding: "20px",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          padding: "20px",
        },
        elevation3: {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          borderRadius: "12px",
          padding: "30px",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          zIndex: 99999,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          alignItems: "self-start",
        },
        gutters: {
          paddingLeft: 0,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          boxShadow: "none",
          borderBottom: "1px solid #E0E0E0",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E0E0E0",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: "4px",
          fontSize: "12px",
        },
        colorSecondary: {
          "&.Mui-checked": { color: "#000000" },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          paddingBottom: "0",
        },
      },
    },
    MuiListItemSecondaryAction: {
      styleOverrides: {
        root: {
          right: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paperScrollPaper: {
          width: 450,
          maxWidth: "100%",
        },
        paper: {
          border: "1px solid #E0E0E0",
          margin: "32px",
          position: "relative",
          background: "#FFFFFF",
          overflowY: "auto",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "500px !important",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: 16,
          color: "#000000",
          padding: "0px 0 0px",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          color: "#000000",
          fontSize: "14px !important",
          fontWeight: "400",
          letterSpacing: "0px",
          textAlign: "left",
          background: "transparent",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
        input: {
          width: "0",
          color: "#000000",
          fontSize: "12px !important",
          fontWeight: "400",
        },
        listbox: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiButton: {
      root: {
        textTransform: "none",
      },
      styleOverrides: {
        outlinedSizeSmall: {
          padding: "7px 18px",
          fontSize: "14px",
          fontWeight: "500",
        },
        containedPrimary: {
          color: "#FFFFFF",
          padding: "10px 24px",
          fontSize: "14px",
          borderRadius: "8px",
          background: "#000000",
          fontWeight: "600",
          lineHeight: "21px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#333333",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          },
        },
        containedSecondary: {
          backgroundColor: "#F5F5F5",
          padding: "10px 24px",
          fontSize: "14px",
          fontWeight: "600",
          lineHeight: "21px",
          color: "#000000",
          borderRadius: "8px",
          border: "1px solid #E0E0E0",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#E0E0E0",
          },
        },
        outlinedPrimary: {
          color: "#000000",
          border: "2px solid #000000 !important",
          padding: "10px 24px",
          fontSize: "14px",
          borderRadius: "8px",
          fontWeight: "600",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#000000",
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {},
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          background: "#FFFFFF",
          outline: "0",
          color: "#000000",
        },
        paper: {
          backgroundColor: "#FFFFFF !important",
          border: "1px solid #E0E0E0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { paddingLeft: "20px" },
      },
    },
    MuiModal: {
      styleOverrides: {
        backdrop: {
          background: "transparent !important",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "0px !important",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none !important",
          cursor: "pointer",
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          "& .MuiPickersArrowSwitcher-button": {
            backgroundColor: "transparent !important",
            color: "#000000 !important",
          },
          "& .MuiPickersCalendarHeader-switchViewButton": {
            backgroundColor: "transparent !important",
            color: "#000000 !important",
            marginLeft: "-15px !important",
          },
          "& .Mui-selected": {
            backgroundColor: "#000000 !important",
            color: "#FFFFFF !important",
            border: "none !important",
            borderRadius: "8px !important",
          },
          "& .MuiPickersCalendarHeader-root": {
            paddingLeft: "30px",
          },
          "& .MuiDayCalendar-slideTransition": {
            minHeight: "210px !important",
          },
          "& .MuiPickersCalendarHeader-labelContainer": {
            fontSize: "15px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 500,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#000000",
          height: "3px",
          borderRadius: "3px 3px 0 0",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "14px",
          "&.Mui-selected": {
            color: "#000000",
            fontWeight: 600,
          },
        },
      },
    },
  },
});

export const createCustomTheme = () => {
  let theme = createTheme(deepmerge(baseOptions, themeOptions));

  if (typeof config !== "undefined" && config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
