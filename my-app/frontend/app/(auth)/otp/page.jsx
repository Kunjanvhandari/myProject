"use client";
import { useState } from "react";
import { Box, Button, Paper, Typography, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";

const MainComponent = styled(Box)(({ theme }) => ({
  "& .otpmainBox": {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    "& .otpBox": {
      width: "420px",
      maxWidth: "95%",
    },
    "& .logoImage": {
      textAlign: "center",
      padding: "30px 20px 10px",
      "& h3": { fontWeight: "700", color: "#1a1a1a", fontSize: "28px" },
      "& h2": { color: "#666", marginTop: "4px", marginBottom: "10px", fontWeight: "400", fontSize: "16px" },
    },
  },
}));

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      router.push("/account");
    }
  };

  return (
    <MainComponent>
      <Box className="otpmainBox">
        <Box className="otpBox">
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box className="logoImage" sx={{ bgcolor: "#f5f5f5" }}>
              <Typography variant="h3">LibriVista</Typography>
              <Typography variant="h2">Enter OTP Code</Typography>
            </Box>
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Enter the 6-digit code sent to your email
              </Alert>
              <form onSubmit={handleVerify}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span style={{ margin: "0 4px" }} />}
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: "45px",
                          height: "55px",
                          fontSize: "20px",
                          textAlign: "center",
                          border: "2px solid #ddd",
                          borderRadius: "8px",
                          outline: "none",
                        }}
                      />
                    )}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={otp.length !== 6}
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
                  Verify & Continue
                </Button>
                <Box textAlign="center" mt={2}>
                  <Typography
                    variant="body2"
                    onClick={() => router.push("/login")}
                    sx={{ color: "#000", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                  >
                    Back to Login
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
