import React from 'react';
import { 
  Container, 
  Typography, 
 Grid, // Use Grid2 for the latest MUI layout engine
  Card, 
  CardMedia, 
  CardContent, 
  Box, 
  Button, 
  Divider,
  Stack,
  Link
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const articleData = [
  { 
    id: 1, 
    img: "/images/footer/book9.svg",
    title: "The Benefits of Reading Physical Books in a Digital Age",
    date: "25 April 2026",
  },
  { 
    id: 2, 
    img: "/images/footer/book10.svg",
    title: "How Library Management Systems Are Transforming Education",
    date: "18 April 2026",
  },
  { 
    id: 3, 
    img: "/images/footer/book11.svg",
    title: "Top 10 Must-Read Books for College Students This Year",
    date: "10 April 2026",
  },
];

export default function ArtistList() {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* Header Section */}
      <Stack alignItems="center" spacing={1} sx={{ mb: 6 }}>
        <Typography 
          variant="caption" 
          sx={{ color: 'text.secondary', letterSpacing: 1.5, fontWeight: 500 }}
        >
          READ OUR ARTICLES
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 4 }}>
          <Divider sx={{ flexGrow: 1, borderColor: '#e0e0e0' }} />
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ fontWeight: 700, color: '#2c3e50', whiteSpace: 'nowrap' }}
        >
          Library News & Articles
        </Typography>
          <Divider sx={{ flexGrow: 1, borderColor: '#e0e0e0' }} />
        </Box>
      </Stack>

      {/* Articles Grid */}
      <Grid container spacing={4}>
        {articleData.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
            <Card elevation={0} sx={{ borderRadius: 0, bgcolor: 'transparent' }}>
              <CardMedia
                component="img"
                height="260"
                image={item.img}
                alt="Reading book"
                sx={{ mb: 2 }}
              />
              <CardContent sx={{ p: 0 }}>
                <Typography variant="caption" sx={{ color: '#b0a695', fontWeight: 600 }}>
                  {item.date}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mt: 1, 
                    mb: 2, 
                    fontWeight: 500, 
                    lineHeight: 1.3,
                    color: '#2c3e50',
                    '&:hover': { color: 'primary.main', cursor: 'pointer' } 
                  }}
                >
                  {item.title}
                </Typography>
                
                <Divider sx={{ mb: 1 }} />
                
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Link href="#" color="inherit"><FacebookIcon sx={{ fontSize: 16 }} /></Link>
                  <Link href="#" color="inherit"><TwitterIcon sx={{ fontSize: 16 }} /></Link>
                  <Link href="#" color="inherit"><InstagramIcon sx={{ fontSize: 16 }} /></Link>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer CTA */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          endIcon={<span>→</span>}
          sx={{ 
            borderRadius: 0, 
            px: 4, 
            py: 1.5, 
            borderColor: '#e0e0e0', 
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: 1,
            '&:hover': { borderColor: '#2c3e50', bgcolor: 'transparent' }
          }}
        >
          Read All Articles
        </Button>
      </Box>
    </Container>
  );
}