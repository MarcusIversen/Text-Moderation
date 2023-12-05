import {createTheme} from "@mui/material/styles";

export const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4facc3",
    },
    error: {
      main: "#c74059",
    },
    background: {
      default: "#041a28",
      paper: "#202121",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background: linear-gradient(to left, #000000, #0a3d62);
          height: 100vh;
          margin: 0;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }
      `,
    },
  },
});
