"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  Container 
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Styled Components for Precision ---

const BlueBorderCard = styled(Paper)(({ theme }) => ({
  maxWidth: 1100,
  margin: '40px auto',
  overflow: 'hidden',
  backgroundColor: '#FFF',
  border: '4px solid #0099FF', // The exact blue border from your snap
  borderRadius: 0,
  boxShadow: 'none',
  [theme.breakpoints.down('md')]: {
    margin: '16px',
  },
}));

const SubscriptionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(4),
  width: '100%',
  maxWidth: '450px',
  border: '1px solid #E0E0E0',
  borderRadius: '4px',
  overflow: 'hidden',
}));

const FAQSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(10, 2),
  backgroundColor: '#FFF',
}));

// --- Main Component ---

export default function BookNewsletter() {
  return (
    <Box component="section" sx={{ width: '100%' }}>
      <Container maxWidth="lg">
        
        {/* Newsletter Block (image_6fb0ba.png) */}
        <BlueBorderCard elevation={0}>
          <Grid container>
            {/* Image side */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  minHeight: { xs: '300px', md: '450px' }
                }}
                src="/images/footer/book18.svg"
                alt="Reading on tablet"
              />
            </Grid>

            {/* Content side */}
            <Grid 
              size={{ xs: 12, md: 6 }} 
              sx={{ 
                backgroundColor: '#FDF2F0', // Pale pink background from snap
                p: { xs: 4, md: 8 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ fontWeight: 800, color: '#000', mb: 2, fontSize: '2.2rem' }}
              >
                Get Free Access to 100+ Books
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', mb: 1, lineHeight: 1.6 }}>
                Subscribe to our newsletter and get instant access to our curated collection of 
                free e-books, reading recommendations, and exclusive library events...
              </Typography>

              <SubscriptionBox component="form">
                <TextField
                  placeholder="Enter email address..."
                  variant="standard"
                  fullWidth
                  required
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      sx: { backgroundColor: '#fff', px: 2, py: 1 }
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  sx={{
                    backgroundColor: '#F26444', // Coral color from snap
                    color: '#fff',
                    px: 3,
                    borderRadius: 0,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    '&:hover': { backgroundColor: '#d95336' }
                  }}
                >
                  Subscribe Now
                </Button>
              </SubscriptionBox>
            </Grid>
          </Grid>
        </BlueBorderCard>

        {/* FAQ Block (image_7037fe.png) */}
        <FAQSection>
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 800, color: '#002B5B', mb: 3 }}
          >
            Have Questions About Our Library?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#4B6584', 
              maxWidth: '650px', 
              margin: '0 auto', 
              mb: 4,
              lineHeight: 1.8 
            }}
          >
            Learn more about our membership plans, borrowing policies, digital library access, 
            and exclusive member benefits. We are here to help you make the most of your reading journey.
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#002B5B',
              color: '#002B5B',
              px: 5,
              py: 1.2,
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '4px',
              '&:hover': { borderColor: '#001a38', backgroundColor: 'rgba(0,43,91,0.04)' }
            }}
          >
            Read FAQ
          </Button>
        </FAQSection>

      </Container>
    </Box>
  );
}