import styled from "@emotion/styled";
import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useRouter } from "next/router";
import LoginLayout from "@/layout/LoginLayout";
const MainComponent = styled("Box")(({ theme }) => ({
  "& .otpmainBox": {
    height: "100%",
    position: "relative",
    zIndex: "999",
    overflowY: "auto",
    "& p": {
      fontWeight: "300",
    },
    "& .loginBox": {
      height: "initail",
      margin: "15px auto",
      maxWidth: " 95%",
      width: "487px",
      maxHeight: "100%",
      "& .otpBox": {
        marginTop: "24px",
        "& p": {
          textAlign: "right",
          width: "100%",
          maxWidth: "340px",
          marginTop: "8px",
        },
      },
    },
    "& .logoImage": {
      width: "100%",
      backgroundSize: "cover !important",
      backgroundRepeat: "no-repeat !important",
      objectFit: "cover !important",
      "& h3": {
        marginTop: "8px",
        fontWeight: "400",
        color: "#000000DE",
      },
      "& h2": {
        marginTop: "24px",
        marginBottom: "24px",
        fontWeight: "400",
        color: "#000000DE",
      },
    },
    "& input": {
      border: "1px solid rgba(0, 0, 0, 0.10)",
      borderRadius: "50px",
      fontSize: "20px",
      height: "55px !important",
      width: "55px !important",
      marginRight: "20px",
      background: "rgba(0, 0, 0, 0.05)",
    },
  },
}));
export default function OtpVerify() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  console.log("euyuye",router.query);
  return (
    <MainComponent>
      <Box className="otpmainBox displayCenter">
        <Box className="loginBox">
          <Paper className="mainBox" elevation={2}>
            <Box className="logoImage displayColumn">
              <img src="/images/loginLayout/realTime.jpg" alt="LibriVista" />
              <Typography variant="h3">LibriVista</Typography>
              <Typography variant="h2" color="primary">
                OTP Verification
              </Typography>
              <Typography
                style={{
                  width: "100%",
                  maxWidht: "350px",
                  textAlign: "center",
                }}
                variant="body2"
              >
                Please enter the 4 digit verification code sent to your email.
                The code is valid for 3 minutes.
              </Typography>
            </Box>
            <Box className="otpBox">
              <Box className="displayCenter">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  autoFocus={true}
                  inputType="number"
                  renderInput={(props) => <input {...props} />}
                  secure
                />
              </Box>
              <Typography variant="body2">02:59</Typography>
            </Box>
            <Box mt={3} mb={2}>
              <Button
                onClick={() => {
                  router.push("/");
                }}
                variant="contained"
                color="primary"
                fullWidth
              >
                Verify & Login
              </Button>
            </Box>
            <Box className="displayCenter" mt={2} mb={3}>
              <Typography variant="body2" style={{ color: "#ED553B", cursor: "pointer" }}>
                Resend Code
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </MainComponent>
  );
}
OtpVerify.getLayout = function getLayout(page) {
  return <LoginLayout>{page}</LoginLayout>;
};
