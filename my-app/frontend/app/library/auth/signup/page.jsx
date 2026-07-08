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
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const MainComponent = styled(Box)(({ theme }) => ({
  "& .signupmainBox": {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    py: 4,
    "& .signupBox": {
      width: "480px",
      maxWidth: "95%",
    },
  },
}));

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { register, socialLogin } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError("Email or phone number is required.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsUpdating(true);
      const result = await register({
        name,
        email: email || undefined,
        phone: phone || undefined,
        password,
      });

      if (result.success) {
        router.push("/library/account");
      } else {
        setError(result.message || "Registration failed.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSocialLogin = (provider) => {
    socialLogin(provider);
  };

  return (
    <MainComponent>
      <Box className="signupmainBox">
        <Box className="signupBox">
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
                Create Account
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                Join LibriVista library today
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
              )}

              <form onSubmit={handleFormSubmit}>
                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#888" }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: "#F9FAFB" },
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#888" }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: "#F9FAFB" },
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                    Phone Number <Typography component="span" sx={{ color: "#888", fontWeight: 400 }}>(Optional)</Typography>
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "#888" }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: "#F9FAFB" },
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 6 characters)"
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

                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>
                    Confirm Password
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#888" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            {showConfirmPassword ? <VisibilityOffIcon sx={{ color: "#888" }} /> : <VisibilityIcon sx={{ color: "#888" }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: "#F9FAFB" },
                    }}
                  />
                </Box>

                <Box mb={2}>
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
                    {isUpdating ? "Creating Account..." : "Create Account"}
                  </Button>
                </Box>
              </form>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="caption" sx={{ color: "#999", fontWeight: 500, whiteSpace: "nowrap" }}>
                  or sign up with
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
                  Already have an account?{" "}
                  <span
                    onClick={() => router.push("/library/auth/login")}
                    style={{ cursor: "pointer", color: "#0EA5E9", fontWeight: 700, textDecoration: "none" }}
                  >
                    Sign In
                  </span>
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 2, color: "rgba(255,255,255,0.4)" }}>
            Register with email or phone, or use your social accounts
          </Typography>
        </Box>
      </Box>
    </MainComponent>
  );
}
