import { Alert, Button, CircularProgress, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

type AuthFormShellProps = {
  title: string;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  footerText: string;
  footerLinkLabel: string;
  footerTo: string;
  children: ReactNode;
};

export const AuthFormShell = ({
  title,
  submitLabel,
  submittingLabel,
  isSubmitting,
  errorMessage,
  footerText,
  footerLinkLabel,
  footerTo,
  children
}: AuthFormShellProps) => (
  <Stack spacing={2.5}>
    <Typography variant="h2">{title}</Typography>
    {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
    {children}
    <Button
      type="submit"
      variant="contained"
      size="large"
      disabled={isSubmitting}
      startIcon={
        isSubmitting ? <CircularProgress color="inherit" size={18} /> : undefined
      }
      sx={{ minHeight: 48 }}
    >
      {isSubmitting ? submittingLabel : submitLabel}
    </Button>
    <Typography color="text.secondary" sx={{ textAlign: "center" }}>
      {footerText}{" "}
      <Button
        component={RouterLink}
        to={footerTo}
        variant="text"
        size="small"
        disabled={isSubmitting}
      >
        {footerLinkLabel}
      </Button>
    </Typography>
  </Stack>
);
