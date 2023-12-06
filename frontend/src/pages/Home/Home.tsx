import React from "react";
import {
  Box,
  CssBaseline,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../../assets/theme.ts";
import { SideBar } from "../../components/SideBar/SideBar.tsx";

const logoImage = "../IconLogo.png"; // Update the path to your logo image

export const Home: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <SideBar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            padding: 2,
          }}
        >
          <Typography variant="h6">Automated Text Moderation V1.0</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              <img src={logoImage} alt="logo" width="86px" height="86px" />
              <Typography variant="h5" sx={{ mt: 1 }}>
                What text can I moderate today?
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
              <TextField
                helperText={
                  "This text moderation platform is not perfect yet, it can be slow with a response, and it can make mistakes. Please use it with patience."
                }
                style={{ width: 800 }}
                variant="outlined"
                placeholder="Write text here..."
                multiline={true}
                maxRows={4}
              />
              <IconButton
                color="primary"
                size="large"
                sx={{ ml: 1, alignSelf: "flex-start" }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
