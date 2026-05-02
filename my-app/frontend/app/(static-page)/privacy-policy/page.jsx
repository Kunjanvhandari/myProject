"use client";
import HomeLayout from "../../layouts/HomeLayout/layout";
import { Box, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import Goback from "../../../src/components/Goback";

const MainDocumentBox = styled(Box, {
  name: "MuiPrivacy",
  slot: "root",
})(({ theme }) => ({
  "& .privacyBox": {
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

export default function PrivacyPolicy() {
  return (
    <HomeLayout>
      <MainDocumentBox>
        <Box className="privacyBox">
          <Container maxWidth="lg">
            <Goback title={"Go Back"} />
            <Typography variant="h3">Privacy Policy</Typography>
            <Typography variant="body2" sx={{ color: "#888", mb: 3 }}>Last updated: April 2026</Typography>

            <Typography variant="body2">
              At LibriVista Library Management System, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our library services, website, and mobile application.
            </Typography>

            <Typography variant="h5">1. Information We Collect</Typography>
            <Typography variant="body2">We collect information that you provide directly to us, including:</Typography>
            <ul>
              <li>Personal identification information (name, email address, phone number, address)</li>
              <li>Government-issued ID details for membership verification</li>
              <li>Payment and billing information</li>
              <li>Reading preferences and borrowing history</li>
              <li>Communications you send to us</li>
            </ul>

            <Typography variant="h5">2. How We Use Your Information</Typography>
            <Typography variant="body2">We use the information we collect to:</Typography>
            <ul>
              <li>Process your membership registration and renewals</li>
              <li>Manage your borrowing account and send due date reminders</li>
              <li>Provide personalized book recommendations</li>
              <li>Process payments and issue receipts</li>
              <li>Send newsletters and updates about library events (with your consent)</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>

            <Typography variant="h5">3. Information Sharing</Typography>
            <Typography variant="body2">
              We do not sell your personal information. We may share your information with:
            </Typography>
            <ul>
              <li>Partner libraries for inter-library loan services</li>
              <li>Payment processors to complete transactions</li>
              <li>Law enforcement when required by law</li>
              <li>Service providers who assist in our operations (under confidentiality agreements)</li>
            </ul>

            <Typography variant="h5">4. Data Security</Typography>
            <Typography variant="body2">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include SSL encryption, secure servers, and regular security audits.
            </Typography>

            <Typography variant="h5">5. Your Rights</Typography>
            <Typography variant="body2">You have the right to:</Typography>
            <ul>
              <li>Access your personal data we hold</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>

            <Typography variant="h5">6. Children Privacy</Typography>
            <Typography variant="body2">
              Our services are available to children under parental supervision. We do not knowingly collect personal information from children under 13 without parental consent. Parents can request access to or deletion of their children data by contacting us.
            </Typography>

            <Typography variant="h5">7. Changes to This Policy</Typography>
            <Typography variant="body2">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the Last Updated date. Continued use of our services after changes constitutes acceptance of the updated policy.
            </Typography>

            <Typography variant="h5">8. Contact Us</Typography>
            <Typography variant="body2">
              If you have questions about this Privacy Policy, please contact us at:
              <br />Email: privacy@librivista.com
              <br />Phone: +977-01-4256789
              <br />Address: Durbar Marg, Kathmandu, Nepal
            </Typography>
          </Container>
        </Box>
      </MainDocumentBox>
    </HomeLayout>
  );
}
