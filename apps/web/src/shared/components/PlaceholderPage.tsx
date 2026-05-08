import { Paper, Stack, Typography } from "@mui/material";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export const PlaceholderPage = ({
  title,
  description
}: PlaceholderPageProps) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      p: { xs: 3, sm: 4 }
    }}
  >
    <Stack spacing={1}>
      <Typography variant="h2">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Stack>
  </Paper>
);
