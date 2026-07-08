"use client";
import { useState } from "react";
import {
  Box, Button, Paper, Typography, TextField, InputAdornment, IconButton, Alert, Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const MainComponent = styled(Box)(({ theme }) => ({
  "& .loginmainBox": {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    "& .loginBox": {
      width: "440px",
      maxWidth: "95%",
    },
  },
}));

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, socialLogin } = useAuth();

  const isPhoneInput = /^[\d\s\-\+\(\)]/.test(emailOrPhone);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailOrPhone.trim()) {
      setError("Email or phone number is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    try {
      setIsUpdating(true);
      const result = await login(emailOrPhone, password);

      if (result.success) {
        router.push("/library/account");
      } else {
        setError(result.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Connection error. Please check that the server is running.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSocialLogin = (provider) => {
    socialLogin(provider);
  };

  const oauthError = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("error") : null;

  return (
    <MainComponent>
      <Box className="loginmainBox">
        <Box className="loginBox">
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{
              textAlign: "center", p: 4, pb: 2,
              background: "linear-gradient(135deg, #1E293B, #0F172A)",
            }}>
              <Box sx={{
                width: 56, height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0EA5E9, #38BDF8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                mx: "auto", mb: 1.5,
              }}>
                <AutoStoriesIcon sx={{ fontSize: 28, color: "#0F172A" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 0.5 }}>
                Welcome Back
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                Sign in to your LibriVista account
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              {(error || oauthError) && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error || (oauthError === "google_auth_failed" ? "Google login failed. Please try again." : "Social login failed. Please try again.")}
                </Alert>
              )}

              <form onSubmit={handleFormSubmit}>
                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                    Email or Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {isPhoneInput ? <PhoneIcon sx={{ color: "#888" }} /> : <EmailIcon sx={{ color: "#888" }} />}
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: "#F9FAFB" },
                    }}
                  />
                </Box>

                <Box mb={1}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#888" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOffIcon sx={{ color: "#888" }} /> : <VisibilityIcon sx={{ color: "#888" }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: "#F9FAFB" },
                    }}
                  />
                </Box>

                <Box mb={2.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isUpdating}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      fontSize: "15px",
                      fontWeight: 700,
                      textTransform: "none",
                      bgcolor: "#0F172A",
                      "&:hover": { bgcolor: "#1E293B" },
                      boxShadow: "0 4px 14px rgba(15,23,42,0.25)",
                    }}
                  >
                    {isUpdating ? "Signing in..." : "Sign In"}
                  </Button>
                </Box>
              </form>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="caption" sx={{ color: "#999", fontWeight: 500, whiteSpace: "nowrap" }}>
                  or continue with
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleSocialLogin("google")}
                  sx={{
                    borderRadius: 2, py: 1, textTransform: "none",
                    borderColor: "#E5E7EB", color: "#333", justifyContent: "flex-start", pl: 2,
                    "&:hover": { borderColor: "#EA4335", bgcolor: "rgba(234,67,53,0.04)" },
                  }}
                  startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
                >
                  Continue with Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleSocialLogin("facebook")}
                  sx={{
                    borderRadius: 2, py: 1, textTransform: "none",
                    borderColor: "#E5E7EB", color: "#333", justifyContent: "flex-start", pl: 2,
                    "&:hover": { borderColor: "#1877F2", bgcolor: "rgba(24,119,242,0.04)" },
                  }}
                  startIcon={<FacebookIcon sx={{ color: "#1877F2" }} />}
                >
                  Continue with Facebook
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleSocialLogin("instagram")}
                  sx={{
                    borderRadius: 2, py: 1, textTransform: "none",
                    borderColor: "#E5E7EB", color: "#333", justifyContent: "flex-start", pl: 2,
                    "&:hover": { borderColor: "#E4405F", bgcolor: "rgba(228,64,95,0.04)" },
                  }}
                  startIcon={<InstagramIcon sx={{ color: "#E4405F" }} />}
                >
                  Continue with Instagram
                </Button>
              </Box>

              <Box textAlign="center">
                <Typography variant="body2" sx={{ color: "#888" }}>
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => router.push("/library/auth/signup")}
                    style={{ cursor: "pointer", color: "#0EA5E9", fontWeight: 700, textDecoration: "none" }}
                  >
                    Sign Up
                  </span>
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 2, color: "rgba(255,255,255,0.4)" }}>
            Use email or phone number to sign in, or continue with social accounts
          </Typography>
        </Box>
      </Box>
    </MainComponent>
  );
}
