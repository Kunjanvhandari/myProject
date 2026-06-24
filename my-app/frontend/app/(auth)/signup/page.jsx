"use client";
import { useState } from "react";
import { Box, Button, Paper, Typography, TextField, InputAdornment, IconButton, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";

const MainComponent = styled(Box)(({ theme }) => ({
  "& .signupmainBox": {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: "999",
    overflowY: "auto",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    py: 4,
    "& .signupBox": {
      width: "480px",
      maxWidth: "95%",
    },
    "& .logoImage": {
      textAlign: "center",
      padding: "30px 20px 10px",
      "& h3": {
        fontWeight: "700",
        color: "#1a1a1a",
        fontSize: "28px",
      },
      "& h2": {
        color: "#666",
        marginTop: "4px",
        marginBottom: "10px",
        fontWeight: "400",
        fontSize: "16px",
      },
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
  const { register } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      const result = await register({ name, email, phone, password });

      if (result.success) {
        router.push("/account");
      } else {
        setError(result.message || "Registration failed. Email may already be in use.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <MainComponent>
      <Box className="signupmainBox">
        <Box className="signupBox">
          <Paper className="mainBox" elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box className="logoImage" sx={{ bgcolor: "#f5f5f5" }}>
              <Typography variant="h3">LibriVista</Typography>
              <Typography variant="h2">Create Library Account</Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              )}

              <form onSubmit={handleFormSubmit}>
                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
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
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
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
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
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
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
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
                    }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
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
                      bgcolor: "#000000",
                      borderRadius: 2,
                      py: 1.5,
                      fontSize: "16px",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#333333" },
                    }}
                  >
                    {isUpdating ? "Creating Account..." : "Sign Up"}
                  </Button>
                </Box>

                <Box textAlign="center" mt={2} mb={2}>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    Already have an account?{" "}
                    <span
                      onClick={() => router.push("/login")}
                      style={{ cursor: "pointer", color: "#000", fontWeight: 600, textDecoration: "underline" }}
                    >
                      Login
                    </span>
                  </Typography>
                </Box>
              </form>
            </Box>
          </Paper>
        </Box>
      </Box>
    </MainComponent>
  );
}
