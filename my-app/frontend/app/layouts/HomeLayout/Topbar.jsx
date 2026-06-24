"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Box, Container, Typography, TextField, IconButton,
  InputAdornment, Divider, useMediaQuery, Drawer, Button, Badge, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ArticleIcon from "@mui/icons-material/Article";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/src/lib/api";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const StyledHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 1000,
  background: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  "& .topBar": {
    background: "#1E293B",
    padding: "6px 0",
    "& .topBarInner": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    "& .contactInfo": {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      color: "rgba(255,255,255,0.85)",
      fontSize: "13px",
    },
    "& .socialLinks": {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      "& a": {
        color: "rgba(255,255,255,0.7)",
        transition: "color 0.2s",
        display: "flex",
        "&:hover": { color: "#fff" },
      },
    },
  },
  "& .mainNav": {
    padding: "12px 0",
    "& .navInner": {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    "& .navLinks": {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
  },
}));

const NavLink = styled(Link)(({ isactive }) => ({
  fontSize: "14px",
  fontWeight: isactive === "true" ? 600 : 500,
  color: isactive === "true" ? "#1E293B" : "#5A5A7A",
  textDecoration: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  transition: "all 0.2s ease",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: isactive === "true" ? "60%" : "0",
    height: "2px",
    background: "#0EA5E9",
    borderRadius: "2px",
    transition: "width 0.3s ease",
  },
  "&:hover": {
    color: "#1E293B",
    background: "rgba(27, 58, 92, 0.04)",
    "&::after": { width: "60%" },
  },
}));

const MobileNavItem = styled(Box)(({ isactive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "14px 24px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  background: isactive === "true" ? "rgba(27, 58, 92, 0.06)" : "transparent",
  borderLeft: isactive === "true" ? "3px solid #0EA5E9" : "3px solid transparent",
  "&:hover": {
    background: "rgba(27, 58, 92, 0.04)",
  },
}));

export default function BookStoreHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [drawerSearchQuery, setDrawerSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);
  const [pendingNotifications, setPendingNotifications] = useState(0);
  const isMobile = useMediaQuery("(max-width:900px)");
  const hideLabels = useMediaQuery("(max-width:1100px)");
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      setMobileSearchOpen(false);
      router.push(`/books?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
    }
  };

  const handleDrawerSearch = (e) => {
    e.preventDefault();
    if (drawerSearchQuery.trim()) {
      setDrawerOpen(false);
      router.push(`/books?search=${encodeURIComponent(drawerSearchQuery.trim())}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchCartCount();
    else setCartCount(0);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAdmin) fetchPendingNotifications();
  }, [isAdmin]);

  const fetchPendingNotifications = async () => {
    try {
      const res = await apiFetch("/admin/notifications");
      const data = await res.json();
      if (data.success) {
        setPendingNotifications(data.notifications.totalPending);
      }
    } catch {
      console.error("Failed to fetch notifications");
    }
  };

  const handleAdminLogin = async () => {
    if (!adminPassword.trim()) {
      setAdminLoginError("Please enter the admin password");
      return;
    }
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
        setAdminLoginError("");
        window.location.href = "/dashboard";
      } else {
        setAdminLoginError(data.message || "Invalid password");
      }
    } catch {
      setAdminLoginError("Login failed. Check server connection.");
    } finally {
      setAdminLoggingIn(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await apiFetch("/reservations?status=pending");
      const data = await res.json();
      if (data.success) setCartCount(data.reservations.length);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  const menuItems = [
    { label: "HOME", href: "/", icon: <HomeIcon /> },
    { label: "BOOKS", href: "/books", icon: <LibraryBooksIcon /> },
    { label: "NEW RELEASE", href: "/new-release", icon: <NewReleasesIcon /> },
    { label: "ABOUT US", href: "/about-us", icon: <InfoIcon /> },
    { label: "CONTACT", href: "/contact-us", icon: <ContactMailIcon /> },
    { label: "BLOG", href: "/blog", icon: <ArticleIcon /> },
  ];

  const iconMenuItems = isAuthenticated
    ? [
        { label: user?.name || "My Account", href: "/account", icon: <AccountCircleIcon /> },
        ...(isAdmin ? [{ label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> }] : []),
        { label: "Sign Out", href: null, icon: <ExitToAppIcon />, action: () => { logout(); setDrawerOpen(false); } },
      ]
    : [
        { label: "Login / Sign Up", href: "/login", icon: <AccountCircleIcon /> },
      ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleMenuClick = (href) => {
    setDrawerOpen(false);
    setMobileSearchOpen(false);
    router.push(href);
  };

  const DrawerContent = () => (
    <Box sx={{ width: 300, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{
        background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
        p: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Avatar
                sx={{ width: 44, height: 44, bgcolor: "#0EA5E9", fontSize: "18px", fontWeight: 700 }}
                src={user?.profileImage || undefined}
              >
                {!user?.profileImage && (user?.name?.charAt(0) || "U")}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700 }}>
                  {user?.name || "User"}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  {user?.membershipType || "Free"} Member
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Avatar
                sx={{ width: 44, height: 44, bgcolor: "#0EA5E9" }}
              >
                <LibraryBooksIcon sx={{ color: "#1E293B" }} />
              </Avatar>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
                LibriVista
              </Typography>
            </>
          )}
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <Box component="form" onSubmit={handleDrawerSearch} sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Search books, authors..."
            size="small"
            value={drawerSearchQuery}
            onChange={(e) => setDrawerSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" size="small">
                    <SearchIcon sx={{ color: "#888" }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "10px", bgcolor: "#F3F3F3", "& fieldset": { border: "none" } },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <Typography variant="caption" sx={{ px: 3, py: 1.5, color: "#999", fontWeight: 600, letterSpacing: "1px", display: "block" }}>
          NAVIGATION
        </Typography>
        {menuItems.map((item) => (
          <MobileNavItem
            key={item.label}
            isactive={isActive(item.href) ? "true" : "false"}
            onClick={() => handleMenuClick(item.href)}
          >
            {React.cloneElement(item.icon, {
              sx: { fontSize: 20, color: isActive(item.href) ? "#1E293B" : "#5A5A7A" },
            })}
            <Typography
              variant="body2"
              sx={{
                fontWeight: isActive(item.href) ? 700 : 500,
                color: isActive(item.href) ? "#1E293B" : "#5A5A7A",
              }}
            >
              {item.label}
            </Typography>
          </MobileNavItem>
        ))}

        <Divider sx={{ my: 1, mx: 2 }} />

        <Typography variant="caption" sx={{ px: 3, py: 1.5, color: "#999", fontWeight: 600, letterSpacing: "1px", display: "block" }}>
          ADMIN
        </Typography>
        <MobileNavItem
          isactive="false"
          onClick={() => { setDrawerOpen(false); setAdminDialogOpen(true); }}
        >
          <LockOutlinedIcon sx={{ fontSize: 20, color: "#1E293B" }} />
          <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
            Admin Panel {pendingNotifications > 0 ? `(${pendingNotifications})` : ""}
          </Typography>
        </MobileNavItem>

        <Divider sx={{ my: 1, mx: 2 }} />

        <Typography variant="caption" sx={{ px: 3, py: 1.5, color: "#999", fontWeight: 600, letterSpacing: "1px", display: "block" }}>
          ACCOUNT
        </Typography>
        {iconMenuItems.map((item) => (
          <MobileNavItem
            key={item.label}
            isactive="false"
            onClick={() => item.action ? item.action() : handleMenuClick(item.href)}
          >
            {React.cloneElement(item.icon, {
              sx: { fontSize: 20, color: "#1E293B" },
            })}
            <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
              {item.label}
            </Typography>
          </MobileNavItem>
        ))}
      </Box>

      <Box sx={{ p: 2.5, borderTop: "1px solid rgba(0,0,0,0.06)", bgcolor: "#FAFAFA" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
          <FacebookIcon sx={{ fontSize: 20, color: "#1877F2", cursor: "pointer" }} />
          <InstagramIcon sx={{ fontSize: 20, color: "#E4405F", cursor: "pointer" }} />
          <TwitterIcon sx={{ fontSize: 20, color: "#1DA1F2", cursor: "pointer" }} />
        </Box>
        <Typography variant="caption" sx={{ color: "#999" }}>
          2026 LibriVista. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <StyledHeader sx={{ boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.06)" }}>
      {/* TOP BAR */}
      <Box className="topBar" sx={{ display: { xs: "none", md: "block" } }}>
        <Container maxWidth="lg">
          <Box className="topBarInner">
            <Box className="contactInfo">
              <PhoneIcon sx={{ fontSize: 14 }} />
              <Link href="tel:+9779763942189" style={{ textDecoration: "none", color: "rgba(255,255,255,0.85)" }}>
                +977-9763942189
              </Link>
              {isAuthenticated && (
                <Typography sx={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", ml: 2 }}>
                  Welcome, {user?.name?.split(" ")[0]}!
                </Typography>
              )}
            </Box>
            <Box className="socialLinks">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookIcon sx={{ fontSize: 16 }} />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramIcon sx={{ fontSize: 16 }} />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterIcon sx={{ fontSize: 16 }} />
              </Link>
              {isAuthenticated && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 2, cursor: "pointer" }} onClick={logout}>
                  <ExitToAppIcon sx={{ fontSize: 14 }} />
                  <Typography sx={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>Sign Out</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* NOTIFICATION BAR */}
      <Box sx={{
        background: "linear-gradient(90deg, #0EA5E9, #38BDF8, #0EA5E9)",
        py: 0.5,
        overflow: "hidden",
        position: "relative",
        whiteSpace: "nowrap",
      }}>
        <Box
          sx={{
            display: "inline-block",
            animation: "scroll-left 25s linear infinite",
            color: "#0F172A",
            fontSize: "13px",
            fontWeight: 600,
            "& > span": { mx: 3 },
            "@keyframes scroll-left": {
              "0%": { transform: "translateX(100vw)" },
              "100%": { transform: "translateX(-100%)" },
            },
          }}
        >
          <span>📚 Welcome to LibriVista - Your Digital Library!</span>
          <span>📖 50,000+ Physical Books Available</span>
          <span>💻 100,000+ E-Books</span>
          {isAdmin && pendingNotifications > 0 && (
            <span>🔔 {pendingNotifications} Pending Request{pendingNotifications !== 1 ? "s" : ""} - Check Admin Panel</span>
          )}
          <span>🆕 New Books Added Weekly</span>
          <span>🚚 Free Delivery on Orders Above Rs. 1000</span>
        </Box>
      </Box>

      {/* MAIN NAV */}
      <Container maxWidth="lg">
        <Box className="mainNav">
          <Box className="navInner">
            {/* Hamburger */}
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ p: 0.5, display: { md: "none" } }}>
              <MenuIcon sx={{ fontSize: 24, color: "#1E293B" }} />
            </IconButton>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
              <Box sx={{
                width: { xs: 38, md: 44 },
                height: { xs: 38, md: 44 },
                position: "relative",
                overflow: "hidden",
                borderRadius: "50%",
                border: "2px solid #0EA5E9",
                mr: 1.5,
              }}>
                <Image
                  src="/images/footer/book22.png"
                  alt="LibriVista"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Typography sx={{
                fontWeight: 800,
                fontSize: { xs: "18px", md: "20px" },
                color: "#1E293B",
                letterSpacing: "-0.5px",
                display: { xs: "none", sm: "block" },
              }}>
                Libri<span style={{ color: "#0EA5E9" }}>Vista</span>
              </Typography>
            </Link>

            {/* Desktop Search */}
            {!isMobile && (
              <Box sx={{ flex: 1, maxWidth: 480, mx: 3 }}>
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
                          <SearchIcon sx={{ color: "#bbb", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "24px",
                        bgcolor: "#F5F5F5",
                        "& fieldset": { border: "none" },
                        "&:hover": { bgcolor: "#F0F0F0" },
                        height: 40,
                      },
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Desktop Nav Links */}
            {!isMobile && (
              <Box className="navLinks">
                {menuItems.map((item) => (
                  <NavLink key={item.label} href={item.href} isactive={isActive(item.href) ? "true" : "false"}>
                    {item.label}
                  </NavLink>
                ))}
              </Box>
            )}

            {/* Right Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
              {isMobile && (
                <IconButton onClick={() => setMobileSearchOpen(!mobileSearchOpen)} size="small">
                  {mobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
              )}

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.8, cursor: "pointer", px: 1, py: 0.5, borderRadius: "8px", "&:hover": { bgcolor: "rgba(27,58,92,0.04)" } }}
                onClick={() => router.push(isAuthenticated ? "/account" : "/login")}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  sx={{ "& .MuiBadge-badge": { bgcolor: isAuthenticated ? "#2D8F6F" : "#bbb", width: 8, height: 8, borderRadius: "50%" } }}
                >
                  {isAuthenticated && user?.profileImage ? (
                    <Avatar sx={{ width: 28, height: 28 }} src={user.profileImage}>
                      {user?.name?.charAt(0) || "U"}
                    </Avatar>
                  ) : (
                    <PersonOutlineIcon sx={{ color: "#5A5A7A" }} />
                  )}
                </Badge>
                {!hideLabels && (
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#5A5A7A", fontSize: "12px" }}>
                    {isAuthenticated ? (user?.name?.split(" ")[0] || "Account") : "Account"}
                  </Typography>
                )}
              </Box>

              {/* Admin Button - Always Visible */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", px: 1, py: 0.5, borderRadius: "8px", "&:hover": { bgcolor: "rgba(27,58,92,0.04)" }, position: "relative" }}
                onClick={() => setAdminDialogOpen(true)}
              >
                <Badge
                  badgeContent={isAdmin ? pendingNotifications : 0}
                  color="error"
                  sx={{ "& .MuiBadge-badge": { fontSize: "9px", fontWeight: 700, minWidth: 16, height: 16 } }}
                >
                  <LockOutlinedIcon sx={{ fontSize: 20, color: isAdmin ? "#0EA5E9" : "#5A5A7A" }} />
                </Badge>
                {!hideLabels && (
                  <Typography variant="caption" sx={{ fontWeight: 600, color: isAdmin ? "#0EA5E9" : "#5A5A7A", fontSize: "12px" }}>
                    Admin
                  </Typography>
                )}
              </Box>

              {isAdmin && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", px: 1, py: 0.5, borderRadius: "8px", "&:hover": { bgcolor: "rgba(27,58,92,0.04)" } }}
                  onClick={() => router.push("/dashboard")}
                >
                  <AdminPanelSettingsIcon sx={{ fontSize: 20, color: "#5A5A7A" }} />
                  {!hideLabels && (
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#5A5A7A", fontSize: "12px" }}>Dashboard</Typography>
                  )}
                </Box>
              )}

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", px: 1, py: 0.5, borderRadius: "8px", "&:hover": { bgcolor: "rgba(27,58,92,0.04)" } }}
                onClick={() => router.push("/cart")}
              >
                <Badge
                  badgeContent={cartCount}
                  sx={{ "& .MuiBadge-badge": { bgcolor: cartCount > 0 ? "#0EA5E9" : "#ccc", color: "#fff", fontSize: "10px", fontWeight: 700, minWidth: 16, height: 16 } }}
                >
                  <ShoppingCartOutlinedIcon sx={{ color: "#5A5A7A" }} />
                </Badge>
                {!hideLabels && (
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#5A5A7A", fontSize: "12px" }}>
                    Cart{cartCount > 0 ? ` (${cartCount})` : ""}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Mobile Search */}
          {mobileSearchOpen && isMobile && (
            <Box sx={{ mt: 2 }}>
              <Box component="form" onSubmit={handleMobileSearch} sx={{ display: "flex" }}>
                <TextField
                  fullWidth
                  placeholder="Search books, authors..."
                  size="small"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#bbb" }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: "24px", bgcolor: "#F5F5F5", "& fieldset": { border: "none" } },
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Container>

      {/* DRAWER */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ "& .MuiDrawer-paper": { width: 300, boxSizing: "border-box" } }}
      >
        <DrawerContent />
      </Drawer>

      {/* ADMIN PASSWORD DIALOG */}
      <Dialog open={adminDialogOpen} onClose={() => { setAdminDialogOpen(false); setAdminPassword(""); setAdminLoginError(""); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center", pt: 3 }}>
          <LockOutlinedIcon sx={{ fontSize: 40, color: "#1E293B", mb: 1, display: "block", mx: "auto" }} />
          Admin Access
        </DialogTitle>
        <DialogContent>
          {adminLoginError && <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>{adminLoginError}</Alert>}
          <TextField
            fullWidth
            label="Admin Password"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdminLogin(); }}
            autoFocus
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: "center", gap: 2 }}>
          <Button
            onClick={() => { setAdminDialogOpen(false); setAdminPassword(""); setAdminLoginError(""); }}
            variant="outlined"
            sx={{ borderRadius: "10px", textTransform: "none", px: 3 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAdminLogin}
            disabled={adminLoggingIn}
            sx={{ borderRadius: "10px", textTransform: "none", px: 3, bgcolor: "#1E293B", "&:hover": { bgcolor: "#0F172A" } }}
          >
            {adminLoggingIn ? "Verifying..." : "Enter Admin"}
          </Button>
        </DialogActions>
      </Dialog>
    </StyledHeader>
  );
}
