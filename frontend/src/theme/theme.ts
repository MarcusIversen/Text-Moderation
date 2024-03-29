import {createTheme} from "@mui/material/styles";

export const defaultTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#4facc3",

        },
        secondary: {
            main: "#282c2c",
        },
        error: {
            main: "#c74059",
        },
        background: {
            default: "#041a28",
            paper: "#161818",
        },
        info: {
            main: "#383f3f",
        }

    },
    components: {
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#041a28",
                },
            },
        },
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

export const errorTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#4facc3",

        },
        secondary: {
            main: "#282c2c",
        },
        error: {
            main: "#c74059",
        },
        background: {
            default: "#041a28",
            paper: "#161818",
        },

    },
    components: {
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#041a28",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: `
        body {
          background: linear-gradient(to left, #000000, #500e1e);
          height: 100vh;
          margin: 0;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }
      `,
        },
    },
});
