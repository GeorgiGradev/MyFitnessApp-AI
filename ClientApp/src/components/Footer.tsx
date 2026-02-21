import { Link } from 'react-router-dom';
import { Box, Typography, Link as MuiLink } from '@mui/material';

const LOGO_SRC = '/images/logo/logo01.jpg';

const tagline =
  "Losing weight isn't easy - we know. But with MyFitnessApp, you'll get the tools you need to successfully take weight off - and keep it off.";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: 'grey.900',
        color: 'white',
        py: 4,
        px: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1.2fr' },
          gap: 4,
          alignItems: 'start',
        }}
      >
        <Box>
          <Box component="img" src={LOGO_SRC} alt="MyFitnessApp" sx={{ height: 36, objectFit: 'contain', mb: 1 }} />
          <Typography variant="body2" sx={{ color: 'grey.400', maxWidth: 320, mb: 1 }}>
            {tagline}
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.500' }}>
            © {new Date().getFullYear()} - MyFitnessApp
          </Typography>
        </Box>

        <Box>
          <Typography variant="overline" sx={{ color: 'grey.400', letterSpacing: 1, display: 'block' }}>
            Special thanks to
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.5 } }}>
            <li>
              <MuiLink href="https://www.myfitnesspal.com" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
                myfitnesspal.com
              </MuiLink>
            </li>
            <li>
              <MuiLink href="https://www.muscleandstrength.com" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
                muscleandstrength.com
              </MuiLink>
            </li>
            <li>
              <MuiLink href="https://www.bodybuilding.com" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
                bodybuilding.com
              </MuiLink>
            </li>
            <li>
              <MuiLink href="https://github.com/NikolayIT" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
                Nikolay Kostov
              </MuiLink>
            </li>
          </Box>
        </Box>

        <Box>
          <Typography variant="overline" sx={{ color: 'grey.400', letterSpacing: 1, display: 'block' }}>
            Useful links
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.5 } }}>
            <li>
              <MuiLink href="https://github.com/GeorgiGradev/MyFitnessApp" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
                Open Source System
              </MuiLink>
            </li>
            <li>
              <MuiLink href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
                YouTube Terms of Service
              </MuiLink>
            </li>
            <li>
              <MuiLink href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
                Google Privacy Policy
              </MuiLink>
            </li>
          </Box>
        </Box>

        <Box>
          <Typography variant="overline" sx={{ color: 'grey.400', letterSpacing: 1, display: 'block' }}>
            Contact
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Dimitrovgrad, Bulgaria
          </Typography>
          <Typography variant="body2">
            <MuiLink href="mailto:info@myfitnessapp.com" color="inherit" underline="hover">
              info@myfitnessapp.com
            </MuiLink>
          </Typography>
          <Typography variant="body2">+359 888 000 000</Typography>
        </Box>
      </Box>
    </Box>
  );
}
