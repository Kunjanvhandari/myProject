'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
   Grid, 
  Card, 
  CardContent, 
  Rating, 
  Link,
  Stack
} from '@mui/material';
import { LuArrowRight } from "react-icons/lu";

const bookData = [
  { id: 1, title: "Atomic Habits", author: "James Clear", rating: 5, image: "/images/footer/book19.svg" },
  { id: 2, title: "The Psychology of Money", author: "Morgan Housel", rating: 5, image: "/images/footer/book20.svg" },
  { id: 3, title: "Ikigai: The Japanese Secret", author: "Hector Garcia", rating: 4, image: "/images/footer/book21.svg" },
  { id: 4, title: "Deep Work", author: "Cal Newport", rating: 5, image: "/images/footer/book20.svg" },
];

const NewReleaseBooks = () => {
  return (
    <Box sx={{ py: 10, bgcolor: '#fff', textAlign: 'center' }}>
      <Container maxWidth="lg">
        
        {/* Section Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a237e', mb: 1 }}>
            New Release Books
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            Fresh additions to our library collection this month. Reserve your copy today!
          </Typography>
          <Link 
            href="/new-release" 
            sx={{ 
              color: '#f05a42', 
              fontWeight: 700, 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center',
              gap: 0.5,
              fontSize: '0.9rem',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            View All New Releases <LuArrowRight />
          </Link>
        </Box>

        {/* Books Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {bookData.map((book) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={book.id}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 4, 
                  border: '1px solid #f0f0f0',
                  transition: '0.3s',
                  '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box 
                    component="img"
                    src={book.image}
                    alt={book.title}
                    sx={{ 
                      width: '100%', 
                      height: '240px', 
                      objectFit: 'contain',
                      mb: 2,
                      borderRadius: 1
                    }}
                  />
                  <Typography 
                    variant="subtitle1" 
                    sx={{ fontWeight: 700, color: '#1a237e', mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {book.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 1 }}>
                    {book.author}
                  </Typography>
                  <Rating value={book.rating} readOnly size="small" sx={{ color: '#ffb400' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination Dots */}
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #f05a42', p: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f05a42' }} />
          </Box>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ccc' }} />
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ccc' }} />
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ccc' }} />
        </Stack>

      </Container>
    </Box>
  );
};

export default NewReleaseBooks;