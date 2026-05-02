'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';

const categories = [
  { title: 'Academic & Textbooks', image: "/images/footer/book13.svg" },
  { title: 'Fiction & Literature', image: "/images/footer/book14.svg" },
  { title: 'Science & Technology', image: "/images/footer/book15.svg" },
  { title: 'History & Culture', image: "/images/footer/book16.svg" },
  { title: 'Self-Help & Growth', image: "/images/footer/book17.svg" },
];

const CategoryCard = ({ title, image, isHeader = false }) => {
  if (isHeader) {
    return (
      <Card 
        variant="outlined" 
        sx={{ 
          height: 280, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: 4,
          border: '1px solid #e0e0e0'
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a237e', mb: 3 }}>
            Explore Our Top <br /> Categories
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#f05a42', 
              textTransform: 'none', 
              px: 4, 
              borderRadius: 2,
              '&:hover': { bgcolor: '#d84315' } 
            }}
          >
            Browse All Books
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: 280, 
        borderRadius: 4, 
        position: 'relative',
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': { transform: 'scale(1.02)' }
      }}
    >
      <CardContent sx={{ width: '100%', pb: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function GallaryBooks() {
  return (
    <Box sx={{ py: 10, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* First Row - Item 1 */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CategoryCard title={categories[0].title} image={categories[0].image} />
          </Grid>
          
          {/* First Row - Center "View All" Header */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CategoryCard isHeader />
          </Grid>
          
          {/* Rest of the Categories */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CategoryCard title={categories[1].title} image={categories[1].image} />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CategoryCard title={categories[2].title} image={categories[2].image} />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CategoryCard title={categories[3].title} image={categories[3].image} />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CategoryCard title={categories[4].title} image={categories[4].image} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}