import React from "react";
import {
  Box,
  CssBaseline,
  TextField,
  Typography,
  IconButton, Paper, CircularProgress
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../../assets/theme.ts";
import { SideBar } from "../../components/SideBar/SideBar.tsx";

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
          <Typography variant="subtitle1" sx={{paddingBottom: 5}}>Automated Text Moderation V1.0</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >

            <Paper sx={{width: 1500, height: 200, borderRadius: 5, backgroundColor: "background.paper"}}>
              <Typography sx={{padding: 2}} variant="h6">
                Moderation Step 1 : Check for bad words
              </Typography>
              <Box sx={{paddingLeft: 3, paddingTop: 2, }}>
                <CircularProgress/>
              </Box>
              <Box sx={{paddingLeft: 2, paddingTop: 2, color: "green"}}>
                <CheckCircleIcon sx={{height: 50, width: 50}}/>
              </Box>
              <Box sx={{paddingLeft: 2, paddingTop: 2,  color: "red"}}>
                <CancelIcon sx={{height: 50, width: 50}}/>
              </Box>
            </Paper>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              {/*<img src={logoImage} alt="logo" width="86px" height="86px" />*/}
              {/*<Typography variant="h5" sx={{ mt: 1 }}>*/}
              {/*  What text can I moderate today?*/}
              {/*</Typography>*/}
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
