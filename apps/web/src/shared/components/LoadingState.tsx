import { CircularProgress, Stack, Typography } from "@mui/material";

type LoadingStateProps = {
  label?: string;
};

export const LoadingState = ({ label = "Loading" }: LoadingStateProps) => (
  <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
    <CircularProgress size={28} />
    <Typography color="text.secondary">{label}</Typography>
  </Stack>
);
