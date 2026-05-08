import { Paper, Stack, Typography } from "@mui/material";

type EmptyStateProps = {
  title: string;
  description: string;
};

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px dashed",
      borderColor: "divider",
      p: 3,
      textAlign: "center"
    }}
  >
    <Stack spacing={1}>
      <Typography variant="h3">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Stack>
  </Paper>
);
