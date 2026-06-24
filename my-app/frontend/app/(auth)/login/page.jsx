"use client";
import { useState } from "react";
import { Box, Button, Paper, Typography, TextField, InputAdornment, IconButton, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const MainComponent = styled(Box)(({ theme }) => ({
  "& .loginmainBox": {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: "999",
    overflowY: "auto",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    "& .loginBox": {
      width: "420px",
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    try {
      setIsUpdating(true);
      const result = await login(email, password);

      if (result.success) {
        router.push("/account");
      } else {
        setError(result.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Connection error. Please check that the server is running.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <MainComponent>
      <Box className="loginmainBox">
        <Box className="loginBox">
          <Paper className="mainBox" elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box className="logoImage" sx={{ bgcolor: "#f5f5f5" }}>
              <Typography variant="h3">LibriVista</Typography>
              <Typography variant="h2">Member Login</Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              )}

              <form onSubmit={handleFormSubmit}>
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
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon sx={{ color: "#888" }} /> : <VisibilityIcon sx={{ color: "#888" }} />}
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
                    {isUpdating ? "Logging in..." : "Login"}
                  </Button>
                </Box>

                <Box textAlign="center" mt={2} mb={2}>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    Don&apos;t have an account?{" "}
                    <span
                      onClick={() => router.push("/signup")}
                      style={{ cursor: "pointer", color: "#000", fontWeight: 600, textDecoration: "underline" }}
                    >
                      Sign Up
                    </span>
                  </Typography>
                </Box>

                <Box textAlign="center" mt={1} mb={2}>
                  <Typography variant="caption" sx={{ color: "#aaa" }}>
                    Use your registered email and password
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
