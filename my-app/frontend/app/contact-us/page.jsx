"use client";
import { Box, Typography, Container, Grid, Card, CardContent, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../layouts/HomeLayout/layout";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ContactUsBox = styled(Box)(({ theme }) => ({
  "& .contactBox": {
    padding: "60px 0",
  },
  "& .heroSection": {
    background: "linear-gradient(135deg, #173F5F 0%, #393280 100%)",
    color: "#fff",
    padding: "80px 0",
    textAlign: "center",
    borderRadius: "0 0 50px 50px",
    marginBottom: "60px",
  },
  "& .contactCard": {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
    padding: "30px 20px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  "& .sectionTitle": {
    color: "#173F5F",
    fontWeight: 800,
    marginBottom: "20px",
    position: "relative",
    "&::after": {
      content: '""',
      display: "block",
      width: "60px",
      height: "4px",
      background: "#ED553B",
      margin: "10px auto",
      borderRadius: "2px",
    },
  },
}));

export default function ContactUs() {
  return (
    <HomeLayout>
      <ContactUsBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color:"white"}}>
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: "700px", margin: "0 auto", opacity: 0.9 , color:"white"}}>
              Have questions about our library services? We would love to hear from you.
              Reach out to us through any of the channels below.
            </Typography>
          </Container>
        </Box>

        <Box className="contactBox">
          <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ mb: 8 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card className="contactCard">
                  <CardContent>
                    <LocationOnIcon sx={{ fontSize: 48, color: "#ED553B", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#173F5F", mb: 1 }}>
                      Address
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Durbar Marg, Kathmandu<br />
                      Bagmati Province, Nepal
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card className="contactCard">
                  <CardContent>
                    <PhoneIcon sx={{ fontSize: 48, color: "#393280", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#173F5F", mb: 1 }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      +977-01-4256789<br />
                      +977 9743962189
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card className="contactCard">
                  <CardContent>
                    <EmailIcon sx={{ fontSize: 48, color: "#ED553B", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#173F5F", mb: 1 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      info@librivista.com<br />
                      support@librivista.com
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card className="contactCard">
                  <CardContent>
                    <AccessTimeIcon sx={{ fontSize: 48, color: "#393280", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#173F5F", mb: 1 }}>
                      Working Hours
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Sun-Fri: 8AM - 7PM<br />
                      Saturday: 10AM - 4PM
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" className="sectionTitle">
                  Send Us a Message
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
                  Fill out the form below and our team will get back to you within 24 hours.
                </Typography>
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="First Name" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Last Name" variant="outlined" />
                    </Grid>
                  </Grid>
                  <TextField fullWidth label="Email Address" variant="outlined" type="email" />
                  <TextField fullWidth label="Phone Number" variant="outlined" />
                  <TextField fullWidth label="Subject" variant="outlined" />
                  <TextField
                    fullWidth
                    label="Your Message"
                    variant="outlined"
                    multiline
                    rows={5}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "#ED553B",
                      borderRadius: "8px",
                      py: 1.5,
                      fontSize: "16px",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#d94a32" },
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h4" className="sectionTitle">
                  Find Us on Map
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
                  Visit our library at the heart of Kathmandu. We are conveniently located
                  near major landmarks and easily accessible by public transportation.
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: "400px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    bgcolor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.586!2d85.317!3d27.700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzAwLjAiTiA4NcKwMTknMDEuMiJF!5e0!3m2!1sen!2snp!4v1"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#173F5F", mb: 2 }}>
                    Frequently Asked Questions
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
                      How do I become a member?
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Visit our library with a valid ID and fill out a membership form. Annual membership starts at Rs. 500.
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
                      Can I reserve books online?
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Yes, members can search and reserve books through our online portal or mobile app.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
                      Do you offer home delivery?
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Yes, we offer book delivery within Kathmandu valley for premium members.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ContactUsBox>
    </HomeLayout>
  );
}
