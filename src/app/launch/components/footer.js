'use client';

import { useContext } from 'react'
import { Box, Typography, Stack, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import BrandLogo from '@/components/brandLogo'
import { IsMobileContext } from '@/hooks/mediaQueryContext';
import { BottomSpaceContext } from '@/hooks/bottomSpaceContext';

export default function Footer() {
  const isMobile = useContext(IsMobileContext);
  const bottomSpace = useContext(BottomSpaceContext);

  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'FAQs', href: '#' },
    { label: 'About', href: '#' },
  ];

  const socialItems = [
    { icon: <TwitterIcon />, href: '#' },
    { icon: <InstagramIcon />, href: '#' },
    { icon: <FacebookIcon />, href: '#' },
  ];

  return (
    <>
      {!isMobile ? (
        <Box
          component="footer"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3,
            px: { xs: 2, sm: 4, md: 6, lg: 8 },
            mt: 4,
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', md: 'auto' }, mb: { xs: 2, md: 0 } }}>
            <Box
              component="a"
              href="/"
              sx={{
                mr: 2,
                color: 'text.secondary',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <BrandLogo />
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              © 2022 Company, Inc
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              flex: 1
            }}
          >
            {navItems.map((item, index) => (
              <Typography
                key={index}
                component="a"
                href={item.href}
                variant="subtitle1"
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { color: 'text.primary' } }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: 'flex-end',
              width: { xs: '100%', md: 'auto' },
              mt: { xs: 2, md: 0 }
            }}
          >
            {socialItems.map((item, index) => (
              <IconButton
                key={index}
                href={item.href}
                size="small"
                color="inherit"
                sx={{ color: 'text.secondary' }}
              >
                {item.icon}
              </IconButton>
            ))}
          </Stack>
        </Box>
      ) : (
        <Box sx={{ height: 56 + bottomSpace + 'px' }} />
      )}
    </>
  )
}
