import { Box, Paper, Stack, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      px: 2,
      py: 4,
      bgcolor: "background.default"
    }}
  >
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        border: "1px solid",
        borderColor: "divider",
        p: { xs: 3, sm: 4 }
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h1">Expense Tracker</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Keep everyday spending organized and readable.
          </Typography>
        </Box>
        <Outlet />
      </Stack>
    </Paper>
  </Box>
);
