'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
 Grid, 
  Stack 
} from '@mui/material';

const DigitalContent = () => {
  return (
    <Box 
      sx={{ 
        backgroundColor: '#f4faff', 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        py: 8,
        // Added the exact margin from your screenshot
        my: '3rem' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          
          {/* Left Content Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 30, height: 2, bgcolor: '#ff5722' }} />
                <Typography 
                  variant="overline" 
                  sx={{ color: '#ff5722', fontWeight: 'bold', letterSpacing: 1.5 }}
                >
                  EBOOK
                </Typography>
              </Box>

              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#1a237e', 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2 
                }}
              >
                Access 100,000+ Digital Books & Resources
              </Typography>

              <Typography variant="body1" sx={{ color: '#5c6bc0', lineHeight: 1.8 }}>
                Join our digital library and get instant access to e-books, audiobooks, research journals,
                and educational resources. Read anywhere, anytime on any device with your LibriVista membership.
              </Typography>

              {/* Login Form Action */}
              <Box 
                component="form" 
                sx={{ 
                  display: 'flex', 
                  bgcolor: 'white', 
                  p: 1, 
                  borderRadius: '8px', 
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                  maxWidth: '500px'
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Enter Your Email Address to Join"
                  InputProps={{ disableUnderline: true }}
                  sx={{ px: 2, py: 1 }}
                />
                <Button 
                  variant="contained" 
                  disableElevation
                  sx={{ 
                    bgcolor: '#f05a42', 
                    '&:hover': { bgcolor: '#d84315' },
                    px: 4,
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Join Free
                </Button>
              </Box>
            </Stack>
          </Grid>

          {/* Right Image Column */}
          <Grid 
            size={{ xs: 12, md: 6 }} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              // Added responsive margin: top margin on small screens, 0 on medium+
              mt: { xs: 4, md: 0 } 
            }}
          >
            <Box 
              component="img"
              src="/images/footer/book12.svg" 
              alt="Student with books"
              sx={{ 
                width: '100%', 
                maxWidth: '500px', 
                height: 'auto',
                display: 'block'
              }}
            />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default DigitalContent;