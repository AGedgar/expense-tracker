import { Alert } from "@mui/material";

type ErrorStateProps = {
  message: string;
};

export const ErrorState = ({ message }: ErrorStateProps) => (
  <Alert severity="error">{message}</Alert>
);
