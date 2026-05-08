import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#176b5d"
    },
    secondary: {
      main: "#3454d1"
    },
    background: {
      default: "#f6f7f9",
      paper: "#ffffff"
    },
    text: {
      primary: "#18212f",
      secondary: "#5f6b7a"
    },
    error: {
      main: "#bf3333"
    },
    warning: {
      main: "#a35f00"
    },
    success: {
      main: "#2d7a46"
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 700
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 700
    },
    button: {
      fontWeight: 700,
      textTransform: "none"
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});
