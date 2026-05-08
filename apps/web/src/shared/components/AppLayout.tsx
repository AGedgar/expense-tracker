import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import { BarChart3, ListChecks, LogOut, Tags } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useLogout } from "../../features/auth/hooks/use-auth";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: BarChart3
  },
  {
    label: "Expenses",
    to: "/expenses",
    icon: ListChecks
  },
  {
    label: "Categories",
    to: "/categories",
    icon: Tags
  }
];

export const AppLayout = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            gap: 3,
            flexWrap: "wrap",
            py: { xs: 1.5, sm: 0 }
          }}
        >
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto" }}>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  startIcon={<Icon size={18} />}
                  sx={{
                    flexShrink: 0,
                    "&.active": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText"
                    }
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            <Tooltip title="Log out">
              <IconButton aria-label="Log out" onClick={handleLogout}>
                <LogOut size={20} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
};
