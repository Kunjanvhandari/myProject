"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Box, Container, Typography, TextField, IconButton,
  InputAdornment, useMediaQuery, Drawer, Badge, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ArticleIcon from "@mui/icons-material/Article";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/src/lib/api";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CodeIcon from "@mui/icons-material/Code";
import { useThemeMode } from "@/app/ThemeRegistry";
import AdminNotificationCenter from "@/app/components/AdminNotificationCenter";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: <HomeIcon /> },
  { label: "Library", href: "/library", icon: <MenuBookIcon /> },
  { label: "Books", href: "/library/books", icon: <LibraryBooksIcon /> },
  { label: "New Releases", href: "/library/new-release", icon: <NewReleasesIcon /> },
  { label: "About", href: "/about-us", icon: <InfoIcon /> },
  { label: "Contact", href: "/contact-us", icon: <ContactMailIcon /> },
  { label: "Blog", href: "/blog", icon: <ArticleIcon /> },
  { label: "Developer", href: "/head-developer", icon: <CodeIcon /> },
];

export default function BookStoreHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { mode, toggleMode } = useThemeMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchCartCount();
    else setCartCount(0);
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const res = await apiFetch("/reservations?status=pending");
      const data = await res.json();
      if (data.success) setCartCount(data.reservations.length);
    } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/library/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminPassword.trim()) { setAdminLoginError("Enter the admin password"); return; }
    setAdminLoggingIn(true);
    setAdminLoginError("");
    try {
      const res = await apiFetch("/auth/admin-login", {
        method: "POST",
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminDialogOpen(false);
        setAdminPassword("");
        window.location.href = "/library/dashboard";
      } else {
        setAdminLoginError(data.message || "Invalid password");
      }
    } catch {
      setAdminLoginError("Login failed. Check server connection.");
    } finally {
      setAdminLoggingIn(false);
    }
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: scrolled
            ? "var(--glass-bg)"
            : "var(--bg-secondary)",
          backdropFilter: scrolled ? "blur(16px) saturate(1.3)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.3)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-color)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.06)" : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              height: { xs: 64, md: 72 },
              transition: "height 0.3s ease",
            }}
          >
            {/* Hamburger */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: "none" }, color: "var(--text-primary)" }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
              <Box
                sx={{
                  width: 40, height: 40, position: "relative", overflow: "hidden",
                  borderRadius: "50%", border: "2px solid", borderColor: "secondary.main", mr: 1.5,
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Image src="/images/footer/book22.png" alt="Logo" fill style={{ objectFit: "cover" }} />
              </Box>
              <Typography
                sx={{
                  fontWeight: 800, fontSize: { xs: "18px", md: "22px" },
                  color: "var(--text-primary)", letterSpacing: "-0.5px",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Saraswati<span style={{ color: "#0EA5E9" }}>Library</span>
              </Typography>
            </Link>

            {/* Search */}
            {!isMobile && (
              <Box sx={{ flex: 1, maxWidth: 400, mx: 2 }}>
                <Box component="form" onSubmit={handleSearch}>
                  <TextField
                    fullWidth
                    placeholder="Search books, authors..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "var(--text-tertiary)", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "100px",
                        bgcolor: "var(--bg-tertiary)",
                        "& fieldset": { border: "none" },
                        height: 40,
                        fontSize: "14px",
                      },
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Desktop Nav */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{ textDecoration: "none", position: "relative" }}
                  >
                    <Box
                      sx={{
                        px: 1.5, py: 0.8, borderRadius: "8px", fontSize: "13px",
                        fontWeight: isActive(item.href) ? 700 : 500,
                        color: isActive(item.href) ? "var(--accent)" : "var(--text-secondary)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: "var(--text-primary)",
                          bgcolor: "var(--bg-tertiary)",
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: -1,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: isActive(item.href) ? "60%" : 0,
                          height: "2px",
                          borderRadius: "2px",
                          background: "var(--accent-gradient)",
                          transition: "width 0.3s ease",
                        },
                        "&:hover::after": { width: isActive(item.href) ? "60%" : "40%" },
                      }}
                    >
                      {item.label}
                    </Box>
                  </Link>
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
              {/* Theme Toggle */}
              <IconButton
                onClick={toggleMode}
                size="small"
                sx={{
                  color: "var(--text-secondary)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "rotate(30deg)", color: "var(--text-primary)" },
                }}
              >
                {mode === "dark" ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
              </IconButton>

              {/* Account */}
              <Box
                onClick={() => router.push(isAuthenticated ? "/library/account" : "/library/auth/login")}
                sx={{
                  display: "flex", alignItems: "center", gap: 0.8, cursor: "pointer",
                  px: 1.2, py: 0.5, borderRadius: "8px",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "var(--bg-tertiary)" },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  sx={{ "& .MuiBadge-badge": { bgcolor: isAuthenticated ? "#10B981" : "var(--text-tertiary)", width: 8, height: 8 } }}
                >
                  {isAuthenticated && user?.profileImage ? (
                    <Avatar sx={{ width: 28, height: 28 }} src={user.profileImage}>
                      {user?.name?.charAt(0) || "U"}
                    </Avatar>
                  ) : (
                    <PersonOutlineIcon sx={{ color: "var(--text-secondary)" }} />
                  )}
                </Badge>
                {!isMobile && (
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "12px" }}>
                    {isAuthenticated ? (user?.name?.split(" ")[0] || "Account") : "Account"}
                  </Typography>
                )}
              </Box>

              {/* Admin */}
              <Box
                onClick={() => setAdminDialogOpen(true)}
                sx={{
                  display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer",
                  px: 1.2, py: 0.5, borderRadius: "8px",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "var(--bg-tertiary)" },
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 20, color: isAdmin ? "var(--accent)" : "var(--text-tertiary)" }} />
                {!isMobile && (
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-tertiary)", fontSize: "12px" }}>
                    Admin
                  </Typography>
                )}
              </Box>

              {/* Dashboard (if admin) */}
              {isAdmin && (
                <Box
                  onClick={() => router.push("/library/dashboard")}
                  sx={{
                    display: "flex", alignItems: "center", cursor: "pointer",
                    px: 1.2, py: 0.5, borderRadius: "8px",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: "var(--bg-tertiary)" },
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 20, color: "var(--text-tertiary)" }} />
                </Box>
              )}

              {/* Admin Notifications (if admin) */}
              {isAdmin && <AdminNotificationCenter />}

              {/* Cart */}
              <Box
                onClick={() => router.push("/library/cart")}
                sx={{
                  display: "flex", alignItems: "center", cursor: "pointer",
                  px: 1.2, py: 0.5, borderRadius: "8px",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "var(--bg-tertiary)" },
                }}
              >
                <Badge
                  badgeContent={cartCount}
                  sx={{ "& .MuiBadge-badge": { bgcolor: cartCount > 0 ? "#0EA5E9" : "var(--text-tertiary)", color: "#fff", fontSize: "10px", fontWeight: 700 } }}
                >
                  <ShoppingCartOutlinedIcon sx={{ color: "var(--text-secondary)" }} />
                </Badge>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 300, bgcolor: "var(--bg-secondary)", borderRight: "1px solid var(--border-color)" } }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
              Menu
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "var(--text-secondary)" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 2, borderBottom: "1px solid var(--border-color)" }}>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { setDrawerOpen(false); router.push(`/library/books?search=${encodeURIComponent(searchQuery.trim())}`); } }}>
              <TextField
                fullWidth placeholder="Search books..." size="small" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end"><IconButton type="submit" size="small"><SearchIcon /></IconButton></InputAdornment>,
                  sx: { borderRadius: "10px", bgcolor: "var(--bg-tertiary)", "& fieldset": { border: "none" } },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
            {NAV_ITEMS.map((item) => (
              <motion.div key={item.href} whileTap={{ scale: 0.97 }}>
                <Box
                  onClick={() => { setDrawerOpen(false); router.push(item.href); }}
                  sx={{
                    display: "flex", alignItems: "center", gap: 2, px: 3, py: 1.8,
                    cursor: "pointer", transition: "all 0.15s ease",
                    bgcolor: isActive(item.href) ? "var(--bg-tertiary)" : "transparent",
                    borderLeft: isActive(item.href) ? "3px solid" : "3px solid transparent",
                    borderColor: "secondary.main",
                    "&:hover": { bgcolor: "var(--bg-tertiary)" },
                  }}
                >
                  <Box sx={{ color: isActive(item.href) ? "var(--accent)" : "var(--text-tertiary)", display: "flex" }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: isActive(item.href) ? 700 : 500, color: "var(--text-primary)" }}>
                    {item.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ p: 2.5, borderTop: "1px solid var(--border-color)" }}>
            <Typography variant="caption" sx={{ color: "var(--text-tertiary)" }}>
              &copy; {new Date().getFullYear()} Saraswati Library
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Admin Dialog */}
      <Dialog open={adminDialogOpen} onClose={() => { setAdminDialogOpen(false); setAdminPassword(""); setAdminLoginError(""); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center", pt: 3 }}>
          <LockOutlinedIcon sx={{ fontSize: 40, color: "var(--accent)", mb: 1, display: "block", mx: "auto" }} />
          Admin Access
        </DialogTitle>
        <DialogContent>
          {adminLoginError && <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>{adminLoginError}</Alert>}
          <TextField
            fullWidth label="Admin Password" type="password" value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdminLogin(); }}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: "center", gap: 2 }}>
          <Button onClick={() => { setAdminDialogOpen(false); setAdminPassword(""); setAdminLoginError(""); }} variant="outlined" sx={{ borderRadius: "10px", textTransform: "none", px: 3 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAdminLogin} disabled={adminLoggingIn} sx={{ borderRadius: "10px", textTransform: "none", px: 3 }}>
            {adminLoggingIn ? "Verifying..." : "Enter Admin"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
