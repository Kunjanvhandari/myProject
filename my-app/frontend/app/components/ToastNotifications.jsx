"use client";
import { Box, Typography, IconButton, Slide } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { useNotifications } from "@/context/NotificationContext";

const toastStyles = {
  position: "fixed",
  top: 16,
  right: 16,
  zIndex: 99999,
  display: "flex",
  flexDirection: "column",
  gap: 1,
  maxWidth: 360,
};

const toastCard = (type) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 1.5,
  p: 1.5,
  borderRadius: "10px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  bgcolor: type === "error" ? "#fef2f2" : type === "warning" ? "#fffbeb" : type === "success" ? "#f0fdf4" : "#eff6ff",
  border: `1px solid ${
    type === "error" ? "#fecaca" : type === "warning" ? "#fde68a" : type === "success" ? "#bbf7d0" : "#bfdbfe"
  }`,
});

const iconMap = {
  error: <WarningIcon sx={{ color: "#f44336", fontSize: 20 }} />,
  warning: <WarningIcon sx={{ color: "#FF9800", fontSize: 20 }} />,
  success: <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 20 }} />,
  info: <InfoIcon sx={{ color: "#0EA5E9", fontSize: 20 }} />,
};

export default function ToastNotifications() {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <Box sx={toastStyles}>
      {toasts.map((toast) => (
        <Slide key={toast.id} direction="left" in mountOnEnter unmountOnExit>
          <Box sx={toastCard(toast.type)}>
            {iconMap[toast.type] || iconMap.info}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "13px" }}>
                {toast.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "#666", display: "block", fontSize: "12px" }}>
                {toast.message}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => dismissToast(toast.id)} sx={{ p: 0.3 }}>
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Slide>
      ))}
    </Box>
  );
}
