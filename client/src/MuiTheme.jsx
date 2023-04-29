import { createTheme } from "@mui/material/styles";

const MuiTheme = createTheme({
  typography: {
    fontFamily: [
      "Rubik",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: { height: "16px" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          lineHeight: "16px",
        },
      },
    },
  },
});

export default MuiTheme;
