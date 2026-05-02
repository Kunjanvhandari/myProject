"use client";
import HomeLayout from "../../layouts/HomeLayout/layout";
import { Box, Typography, Container, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { styled } from "@mui/material/styles";
import Goback from "../../../src/components/Goback";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MainDocumentBox = styled(Box, {
  name: "MuiFAQs",
  slot: "root",
})(({ theme }) => ({
  "& .faqBox": {
    marginTop: "40px",
    padding: "40px 0",
    "& h1": {
      color: "#173F5F",
      fontWeight: 800,
      marginBottom: "10px",
    },
    "& .subtitle": {
      color: "#666",
      marginBottom: "30px",
    },
  },
}));

const faqData = [
  {
    question: "How do I become a member of LibriVista Library?",
    answer: "To become a member, visit our library with a valid government-issued ID (citizenship card, passport, or driving license) and fill out the membership registration form. You can also register online through our website. Annual membership starts at Rs. 500 for students and Rs. 1000 for general members. Premium membership with home delivery is available at Rs. 2500/year.",
  },
  {
    question: "How many books can I borrow at a time?",
    answer: "Standard members can borrow up to 3 books for 14 days. Premium members can borrow up to 7 books for 21 days. Academic members (students and teachers with valid institutional ID) can borrow up to 5 books for 30 days. All memberships include access to our digital library with unlimited e-book reading.",
  },
  {
    question: "Can I reserve books online?",
    answer: "Yes, members can search and reserve books through our online portal or mobile app. Reserved books are held for 48 hours at the pickup counter of your choice. You will receive an SMS and email notification when your reserved book is ready for pickup.",
  },
  {
    question: "What is the late fee for overdue books?",
    answer: "Late fees are Rs. 5 per book per day for the first week, Rs. 10 per book per day for the second week, and Rs. 15 per book per day thereafter. If a book is not returned within 60 days, it is considered lost and the replacement cost will be charged to your account.",
  },
  {
    question: "Do you offer home delivery of books?",
    answer: "Yes, premium members enjoy free home delivery within Kathmandu valley. Books are delivered within 2-3 business days. For locations outside Kathmandu, a nominal delivery charge of Rs. 100-200 applies depending on the distance. Return pickup is also available for premium members.",
  },
  {
    question: "How can I access e-books and digital resources?",
    answer: "All members get free access to our digital library. Simply log in to your account on our website or mobile app using your membership number and password. You can read e-books online or download them for offline reading (DRM-protected). Our digital collection includes over 100,000 e-books, audiobooks, and research journals.",
  },
  {
    question: "Can I renew my borrowed books?",
    answer: "Yes, books can be renewed once for an additional 14 days through our website, app, or by visiting the library. Renewals are not allowed if another member has reserved the same book. Late fees continue to accrue until renewal is processed.",
  },
  {
    question: "Do you organize any events or reading programs?",
    answer: "Yes, we regularly organize book clubs, author talks, reading challenges, storytelling sessions for children, and literary workshops. Members receive notifications about upcoming events. We also celebrate National Reading Month with special activities and discounts in September.",
  },
];

export default function FAQs() {
  return (
    <HomeLayout>
      <MainDocumentBox>
        <Box className="faqBox">
          <Container maxWidth="lg">
            <Goback title={"Go Back"} />
            <Typography variant="h3">Frequently Asked Questions</Typography>
            <Typography variant="body1" className="subtitle">
              Find answers to common questions about our library services, membership, and policies.
            </Typography>

            {faqData.map((faq, index) => (
              <Accordion key={index} sx={{ mb: 2, borderRadius: "8px !important", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#173F5F" }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.8 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}

            <Box sx={{ mt: 6, textAlign: "center", p: 4, bgcolor: "#f8f9fa", borderRadius: "12px" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#173F5F", mb: 1 }}>
                Still have questions?
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                Contact our support team and we will be happy to help you.
              </Typography>
              <Box component="a" href="/contact-us" sx={{ color: "#ED553B", fontWeight: 600, textDecoration: "none" }}>
                Contact Us →
              </Box>
            </Box>
          </Container>
        </Box>
      </MainDocumentBox>
    </HomeLayout>
  );
}
