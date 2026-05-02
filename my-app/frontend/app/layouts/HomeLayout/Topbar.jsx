"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Box, Container, Typography, TextField, IconButton,
  InputAdornment, Grid, Divider, useMediaQuery, Drawer, Button, Badge
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/src/lib/api";

// --- Styled Components ---
const NavItem = styled(Typography)(({ isActive }) => ({
  fontSize: "14px",
  fontWeight: isActive ? "700" : "500",
  color: isActive ? "#ED553B" : "#484848",
  cursor: "pointer",
  padding: "10px 20px",
  transition: "0.3s",
  borderBottom: isActive ? "2px solid #ED553B" : "2px solid transparent",
  "&:hover": { color: "#ED553B" },
}));

const MobileMenuItem = styled(Box)(({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "14px 24px",
  cursor: "pointer",
  transition: "0.2s",
  backgroundColor: isActive ? "#FFF3F0" : "transparent",
  borderLeft: isActive ? "4px solid #ED553B" : "4px solid transparent",
  "&:hover": {
    backgroundColor: isActive ? "#FFF3F0" : "#F9F9F9",
  },
}));

export default function BookStoreHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isResponsiveMode = useMediaQuery("(max-width:900px)");
  const hideLabels = useMediaQuery("(max-width:1150px)");

  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const res = await apiFetch("/api/reservations?status=pending");
      const data = await res.json();
      if (data.success) {
        setCartCount(data.reservations.length);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  const menuItems = [
    { label: "HOME", href: "/", icon: <HomeIcon /> },
    { label: "ABOUT US", href: "/about-us", icon: <InfoIcon /> },
    { label: "BOOKS", href: "/books", icon: <LibraryBooksIcon /> },
    { label: "NEW RELEASE", href: "/new-release", icon: <NewReleasesIcon /> },
    { label: "CONTACT US", href: "/contact-us", icon: <ContactMailIcon /> },
    { label: "BLOG", href: "/blog", icon: <ArticleIcon /> },
  ];

  const iconMenuItems = isAuthenticated
    ? [
        { label: user?.name || "My Account", href: "/account", icon: <AccountCircleIcon />, action: null },
        { label: "CART", href: "/cart", icon: <ShoppingCartIcon />, badge: cartCount, action: null },
        { label: "Sign Out", href: null, icon: <ExitToAppIcon />, action: () => { logout(); setDrawerOpen(false); } },
      ]
    : [
        { label: "Login / Sign Up", href: "/auth/login", icon: <AccountCircleIcon />, action: null },
        { label: "CART", href: "/cart", icon: <ShoppingCartIcon />, badge: cartCount, action: null },
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
      {/* Drawer Header */}
      <Box sx={{
        background: "linear-gradient(135deg, #ED553B 0%, #d94a32 100%)",
        p: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Box sx={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                bgcolor: "#d94a32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700,
                color: "#fff",
              }}>
                {user?.name?.charAt(0) || "U"}
              </Box>
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
              <Box sx={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
              }}>
                <Image
                  src="/images/footer/book22.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                LibriVista
              </Typography>
            </>
          )}
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Search Bar in Drawer */}
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
        <TextField
          fullWidth
          placeholder="Search Books, Authors..."
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#888" }} />
              </InputAdornment>
            ),
            sx: { borderRadius: "8px", bgcolor: "#F3F3F3", "& fieldset": { border: "none" } },
          }}
        />
      </Box>

      {/* Menu Items */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <Typography variant="caption" sx={{ px: 3, py: 1, color: "#999", fontWeight: 600, display: "block" }}>
          MAIN MENU
        </Typography>
        {menuItems.map((item) => (
          <MobileMenuItem
            key={item.label}
            isActive={isActive(item.href)}
            onClick={() => handleMenuClick(item.href)}
          >
            {React.cloneElement(item.icon, {
              sx: { fontSize: 20, color: isActive(item.href) ? "#ED553B" : "#888888" },
            })}
            <Typography
              variant="body2"
              sx={{
                fontWeight: isActive(item.href) ? 700 : 500,
                color: isActive(item.href) ? "#ED553B" : "#333333",
              }}
            >
              {item.label}
            </Typography>
          </MobileMenuItem>
        ))}

        <Divider sx={{ my: 1, mx: 2 }} />

        <Typography variant="caption" sx={{ px: 3, py: 1, color: "#999", fontWeight: 600, display: "block" }}>
          MY ACCOUNT
        </Typography>
        {iconMenuItems.map((item) => (
          <MobileMenuItem
            key={item.label}
            isActive={item.href ? isActive(item.href) : false}
            onClick={() => item.action ? item.action() : handleMenuClick(item.href)}
          >
            {React.cloneElement(item.icon, {
              sx: { fontSize: 20, color: "#ED553B" },
            })}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#333333" }}>
                {item.label}
              </Typography>
              {item.badge > 0 && (
                <Box sx={{
                  bgcolor: "#ED553B",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                }}>
                  {item.badge}
                </Box>
              )}
            </Box>
          </MobileMenuItem>
        ))}
      </Box>

      {/* Drawer Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid #eee", bgcolor: "#F9F9F9" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FacebookIcon sx={{ fontSize: 20, color: "#1877F2", cursor: "pointer" }} />
          <InstagramIcon sx={{ fontSize: 20, color: "#E4405F", cursor: "pointer" }} />
          <TwitterIcon sx={{ fontSize: 20, color: "#1DA1F2", cursor: "pointer" }} />
        </Box>
        <Typography variant="caption" sx={{ color: "#999" }}>
          2026 LibriVista Library. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff" }}>
      {/* TIER 1: TOP BAR */}
      <Box sx={{ bgcolor: "#ED553B", py: 0.8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon sx={{ fontSize: 16 }} />
              <Link href="tel:+977014256789" style={{ textDecoration: "none", color: "#fff" }}>
                <Typography sx={{ fontSize: "14px", color: "white", fontWeight: 500 }}>+977-01-4256789</Typography>
              </Link>
              {isAuthenticated && (
                <Typography sx={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", ml: 2, display: { xs: "none", sm: "block" } }}>
                  Welcome, {user?.name?.split(" ")[0]}!
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookIcon sx={{ fontSize: 18, cursor: 'pointer', color: "#fff" }} />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramIcon sx={{ fontSize: 18, cursor: 'pointer', color: "#fff" }} />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterIcon sx={{ fontSize: 18, cursor: 'pointer', color: "#fff" }} />
              </Link>
              {isAuthenticated && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 1, cursor: "pointer" }} onClick={logout}>
                  <ExitToAppIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                    Sign Out
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* TIER 2: LOGO & ACTION ICONS */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Grid container spacing={1} alignItems="center" wrap="nowrap">
          
          {/* HAMBURGER MENU ICON */}
          <Grid item xs="auto">
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ p: 1 }}>
              <MenuIcon sx={{ fontSize: 24, color: "#ED553B" }} />
            </IconButton>
          </Grid>

          {/* LOGO */}
          <Grid item xs="auto" md={2}>
            <Link href="/" style={{ display: "block" }}>
              <Box sx={{ 
                width: { xs: 45, md: 70 }, 
                height: { xs: 45, md: 70 }, 
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '50%',
              }}>
                <Image 
                  src="/images/footer/book22.png"
                  alt="LibriVista Library Logo" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            </Link>
          </Grid>

          {/* DESKTOP SEARCH BAR */}
          {!isResponsiveMode && (
            <Grid item xs sx={{ px: 4 }}>
              <TextField
                fullWidth placeholder="Search Books, Authors, ISBN..." size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ cursor: "pointer" }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "20px", bgcolor: "#F3F3F3", "& fieldset": { border: "none" } },
                }}
              />
            </Grid>
          )}

          {/* ICON GROUP */}
          <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
            {isResponsiveMode && (
              <IconButton onClick={() => setMobileSearchOpen(!mobileSearchOpen)} sx={{ mr: 1 }}>
                {mobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
              </IconButton>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": { color: "#ED553B" },
              }}
              onClick={() => router.push(isAuthenticated ? "/account" : "/auth/login")}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: isAuthenticated ? "#ED553B" : "#888",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                  }
                }}
              >
                <PersonOutlineIcon />
              </Badge>
              {!hideLabels && (
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {isAuthenticated ? user?.name?.split(" ")[0] || "ACCOUNT" : "ACCOUNT"}
                </Typography>
              )}
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ height: 20, display: { xs: 'none', md: 'block' }, mx: 1 }} />
            
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": { color: "#ED553B" },
              }}
              onClick={() => router.push("/cart")}
            >
              <Badge
                badgeContent={cartCount}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: cartCount > 0 ? "#ED553B" : "#ccc",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                  }
                }}
              >
                <LocalMallOutlinedIcon />
              </Badge>
              {!hideLabels && (
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  CART{cartCount > 0 ? ` (${cartCount})` : ""}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Mobile Search Dropdown */}
        {mobileSearchOpen && isResponsiveMode && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              placeholder="Search Books, Authors, ISBN..."
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: "20px", bgcolor: "#F3F3F3", "& fieldset": { border: "none" } },
              }}
            />
          </Box>
        )}
      </Container>

      <Divider />

      {/* DESKTOP NAVIGATION */}
      {!isResponsiveMode && (
        <Box sx={{ py: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  <Link href={item.href} style={{ textDecoration: "none" }}>
                    <NavItem isActive={isActive(item.href)}>{item.label}</NavItem>
                  </Link>
                  {index < menuItems.length - 1 && <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />}
                </React.Fragment>
              ))}
            </Box>
          </Container>
          <Divider />
        </Box>
      )}

      {/* HAMBURGER DRAWER (Mobile) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
          },
        }}
      >
        <DrawerContent />
      </Drawer>
    </Box>
  );
}
