import { useState } from 'react';
import { Box, Typography } from '@mui/material';

const HOMEPAGE_IMAGES = [
  { src: '/images/homepage/mainimage01.jpg', alt: 'Fitness and wellness' },
  { src: '/images/homepage/mainimage02.jpg', alt: 'Fitness and wellness' },
];

export default function HomePage() {
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const handleError = (index: number) => {
    setErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <Box sx={{ backgroundColor: '#fff', minHeight: '100%', width: '100%', boxSizing: 'border-box' }}>
      <Box sx={{ maxWidth: 1100, width: '100%', mx: 'auto', px: 2, boxSizing: 'border-box' }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          align="center"
          sx={{ pt: 4, pb: 3, px: 2 }}
        >
          Welcome to MyFitnessApp
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              maxWidth: '100%',
            }}
          >
            {HOMEPAGE_IMAGES.map((img, index) =>
              !errors[index] ? (
                <Box
                  key={img.src}
                  component="img"
                  src={img.src}
                  alt={img.alt}
                  onError={() => handleError(index)}
                  sx={{
                    maxWidth: { xs: '100%', md: 500 },
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              ) : null
            )}
          </Box>
        </Box>
        {Object.keys(errors).length === HOMEPAGE_IMAGES.length && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ pb: 4 }}>
            Images not loaded. Ensure ClientApp/public/images/homepage/ contains mainimage01.jpg and mainimage02.jpg (see images/README.md).
          </Typography>
        )}
      </Box>
    </Box>
  );
}
