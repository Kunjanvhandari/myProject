"use client";
import { useState, useRef, useEffect } from "react";
import {
  Box, Typography, IconButton, Badge, Paper, List, ListItem,
  ListItemText, ListItemAvatar, Avatar, Divider, Button, Chip,
  CircularProgress, Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";

export default function AdminNotificationCenter() {
  const { user, isAdmin } = useAuth();
  const {
    notifications, unreadCount, loading,
    markAsRead, markAllAsRead, deleteNotification, clearAll,
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          anchorRef.current && !anchorRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircleIcon sx={{ color: "#4CAF50" }} />;
      case "warning": return <WarningIcon sx={{ color: "#FF9800" }} />;
      case "error": return <WarningIcon sx={{ color: "#f44336" }} />;
      default: return <InfoIcon sx={{ color: "#0EA5E9" }} />;
    }
  };

  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Tooltip title={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}>
        <IconButton
          ref={anchorRef}
          onClick={() => setOpen(!open)}
          sx={{ color: "#fff" }}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {open && (
        <Paper
          ref={panelRef}
          elevation={8}
          sx={{
            position: "absolute",
            top: "100%",
            right: 0,
            mt: 1,
            width: 380,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            overflow: "hidden",
            zIndex: 9999,
            boxShadow: "0 12px 50px rgba(0,0,0,0.15)",
          }}
        >
          <Box sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
            bgcolor: "#FAFAFA",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <NotificationsIcon sx={{ fontSize: 20, color: "#333" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  sx={{ bgcolor: "#f44336", color: "#fff", fontWeight: 700, height: 20, fontSize: "11px" }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead} sx={{ textTransform: "none", fontSize: "12px" }}>
                  Mark all read
                </Button>
              )}
              <IconButton size="small" onClick={() => setOpen(false)}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
                <NotificationsIcon sx={{ fontSize: 40, color: "#ddd", mb: 1 }} />
                <Typography variant="body2" sx={{ color: "#999" }}>
                  No notifications yet
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {notifications.slice(0, 50).map((notif) => (
                  <Box key={notif._id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        py: 1.5,
                        px: 2,
                        bgcolor: notif.isRead ? "transparent" : "rgba(14,165,233,0.04)",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#F5F5F5" },
                      }}
                      onClick={() => !notif.isRead && markAsRead(notif._id)}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                          sx={{ opacity: 0.4, "&:hover": { opacity: 1 } }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar sx={{ minWidth: 40 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "transparent" }}>
                          {getIcon(notif.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: notif.isRead ? 400 : 700, fontSize: "13px" }}>
                              {notif.title}
                            </Typography>
                            {!notif.isRead && (
                              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#0EA5E9", flexShrink: 0 }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="caption" sx={{ color: "#666", display: "block", fontSize: "12px", mt: 0.3 }}>
                              {notif.message}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#aaa", fontSize: "11px" }}>
                              {getTimeAgo(notif.createdAt)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </Box>
                ))}
              </List>
            )}
          </Box>

          {notifications.length > 0 && (
            <Box sx={{
              p: 1.5,
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "center",
              bgcolor: "#FAFAFA",
            }}>
              <Button
                size="small"
                onClick={clearAll}
                sx={{ textTransform: "none", color: "#f44336", fontSize: "12px" }}
              >
                Clear All Notifications
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
