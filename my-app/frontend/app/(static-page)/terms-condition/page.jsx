"use client";
import HomeLayout from "../../layouts/HomeLayout/layout";
import { Box, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import Goback from "../../../src/components/Goback";

const MainDocumentBox = styled(Box, {
  name: "MuiTerms",
  slot: "root",
})(({ theme }) => ({
  "& .termBox": {
    marginTop: "40px",
    padding: "40px 0",
    "& h1": {
      color: "#173F5F",
      fontWeight: 800,
      marginBottom: "10px",
    },
    "& h2": {
      color: "#173F5F",
      fontWeight: 700,
      marginTop: "30px",
      marginBottom: "10px",
    },
    "& p": {
      color: "#555",
      lineHeight: 1.8,
      marginBottom: "15px",
    },
    "& ul": {
      color: "#555",
      lineHeight: 1.8,
      paddingLeft: "20px",
      marginBottom: "15px",
    },
    "& li": {
      marginBottom: "8px",
    },
  },
}));

export default function TermsCondition() {
  return (
    <HomeLayout>
      <MainDocumentBox>
        <Box className="termBox">
          <Container maxWidth="lg">
            <Goback title={"Go Back"} />
            <Typography variant="h3">Terms and Conditions</Typography>
            <Typography variant="body2" sx={{ color: "#888", mb: 3 }}>Last updated: April 2026</Typography>

            <Typography variant="body2">
              Welcome to LibriVista Library Management System. These Terms and Conditions govern your use of our library services, website, and mobile application. By accessing or using our services, you agree to be bound by these terms.
            </Typography>

            <Typography variant="h5">1. Membership</Typography>
            <Typography variant="body2">1.1 Library membership is available to individuals aged 12 and above.</Typography>
            <Typography variant="body2">1.2 Members must provide accurate and complete information during registration.</Typography>
            <Typography variant="body2">1.3 Membership cards are non-transferable and must be presented when borrowing materials.</Typography>
            <Typography variant="body2">1.4 Membership fees are non-refundable once the membership period has begun.</Typography>

            <Typography variant="h5">2. Borrowing Policies</Typography>
            <Typography variant="body2">2.1 Members may borrow books according to their membership tier limits.</Typography>
            <Typography variant="body2">2.2 The standard borrowing period is 14 days, with one renewal allowed if no other member has reserved the item.</Typography>
            <Typography variant="body2">2.3 Members are responsible for all materials borrowed on their account.</Typography>
            <Typography variant="body2">2.4 Lost or damaged books must be replaced or paid for at the current market value plus a processing fee of Rs. 100.</Typography>

            <Typography variant="h5">3. Late Fees and Penalties</Typography>
            <Typography variant="body2">3.1 Late fees accrue at Rs. 5 per book per day for the first week, Rs. 10 for the second week, and Rs. 15 thereafter.</Typography>
            <Typography variant="body2">3.2 Accounts with outstanding late fees exceeding Rs. 500 will be suspended until cleared.</Typography>
            <Typography variant="body2">3.3 Books not returned within 60 days are considered lost, and the full replacement cost will be charged.</Typography>

            <Typography variant="h5">4. Digital Resources</Typography>
            <Typography variant="body2">4.1 E-books and digital content are licensed for personal use only.</Typography>
            <Typography variant="body2">4.2 Downloading, copying, or distributing digital content beyond personal use is strictly prohibited.</Typography>
            <Typography variant="body2">4.3 Digital borrowing limits may apply based on publisher licensing agreements.</Typography>

            <Typography variant="h5">5. Code of Conduct</Typography>
            <Typography variant="body2">Members agree to:</Typography>
            <ul>
              <li>Respect library staff and other patrons</li>
              <li>Maintain quiet in designated quiet areas</li>
              <li>Handle library materials with care</li>
              <li>Follow all posted rules and regulations</li>
              <li>Not engage in any illegal activity on library premises</li>
            </ul>

            <Typography variant="h5">6. Suspension and Termination</Typography>
            <Typography variant="body2">6.1 Membership may be suspended for repeated violations of these terms.</Typography>
            <Typography variant="body2">6.2 Membership may be terminated for serious misconduct or illegal activity.</Typography>
            <Typography variant="body2">6.3 Suspended members lose all borrowing privileges until the suspension is lifted.</Typography>

            <Typography variant="h5">7. Limitation of Liability</Typography>
            <Typography variant="body2">
              LibriVista shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. We do not guarantee uninterrupted access to our digital services and reserve the right to modify or discontinue services at any time.
            </Typography>

            <Typography variant="h5">8. Modifications to Terms</Typography>
            <Typography variant="body2">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Continued use of our services after changes constitutes acceptance of the modified terms.
            </Typography>

            <Typography variant="h5">9. Governing Law</Typography>
            <Typography variant="body2">
              These Terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.
            </Typography>

            <Typography variant="h5">10. Contact Information</Typography>
            <Typography variant="body2">
              For questions about these Terms, contact us at:
              <br />Email: legal@librivista.com
              <br />Phone: +977-01-4256789
              <br />Address: Durbar Marg, Kathmandu, Nepal
            </Typography>
          </Container>
        </Box>
      </MainDocumentBox>
    </HomeLayout>
  );
}
