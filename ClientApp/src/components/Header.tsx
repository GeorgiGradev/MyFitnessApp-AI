import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Typography, Button, Link as MuiLink } from "@mui/material";

const LOGO_SRC = "/images/logo/logo01.jpg";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Profile", to: "/profile" },
  { label: "Workout", to: "/diaries" },
  { label: "Nutrition", to: "/foods" },
  { label: "Community", to: "/forum" },
  { label: "Social", to: "/social" },
  { label: "Blog", to: "/blog" },
] as const;

interface HeaderProps {
  email: string | null;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Header({ email, isAdmin, onLogout }: HeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  return (
    <Box
      component="header"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          py: 1.5,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: "1 1 auto",
            minWidth: 0,
          }}
        >
          {!logoError ? (
            <MuiLink
              component={Link}
              to="/"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box
                component="img"
                src={LOGO_SRC}
                alt="MyFitnessApp"
                onError={() => setLogoError(true)}
                sx={{ height: 40, objectFit: "contain" }}
              />
            </MuiLink>
          ) : (
            <MuiLink component={Link} to="/" underline="none" color="inherit">
              <Typography variant="h6" fontWeight={700}>
                MyFitnessApp
              </Typography>
            </MuiLink>
          )}
          <Box
            component="nav"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            {navItems.map(({ label, to }) => (
              <Button
                key={to}
                component={Link}
                to={to}
                size="small"
                variant="text"
                color={location.pathname === to ? "primary" : "inherit"}
                sx={{
                  fontWeight: location.pathname === to ? 600 : 400,
                  textTransform: "uppercase",
                  minWidth: "auto",
                  px: 1,
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}
        >
          {email && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: "lowercase" }}
            >
              hi {email}
            </Typography>
          )}
          {isAdmin && (
            <Button
              component={Link}
              to="/admin"
              size="small"
              variant="text"
              sx={{ textTransform: "uppercase", minWidth: "auto" }}
            >
              Admin
            </Button>
          )}
          <Button
            size="small"
            variant="text"
            onClick={onLogout}
            sx={{ textTransform: "uppercase", minWidth: "auto" }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
