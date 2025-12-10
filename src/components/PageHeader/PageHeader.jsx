// src/components/PageHeader/PageHeader.jsx

import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const PageHeader = ({ title, subtitle, image }) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, #2AA7FF, #0C8CE5)',
        borderBottomLeftRadius: '1rem',
        borderBottomRightRadius: '1rem',
        color: 'white',
        py: 8,
        mb: 6,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ mb: { xs: 4, md: 0 } }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                color: 'white',
                mb: 2,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                maxWidth: '600px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {subtitle}
            </Typography>
          </Box>
          {image && (
            <Box
              component="img"
              src={image}
              alt={title}
              sx={{
                width: { xs: '100%', md: '40%' },
                maxWidth: '450px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PageHeader;