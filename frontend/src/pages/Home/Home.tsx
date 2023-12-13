import React, {useEffect, useState} from "react";
import {Box, CircularProgress, CssBaseline, IconButton, Paper, TextField, Typography} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {ThemeProvider} from "@mui/material/styles";
import {defaultTheme} from "../../assets/theme.ts";
import {SideBar} from "../../components/SideBar/SideBar.tsx";
import {ModerationService} from "../../services/ModerationService.ts";
import Cookies from "universal-cookie";
import {jwtDecode, JwtPayload} from "jwt-decode";

interface TokenPayload extends JwtPayload {
  id?: string;
  firstName: string;
  lastName: string;
}


export const Home: React.FunctionComponent = () => {

  const cookies = new Cookies();
  const moderationService = new ModerationService();

  const cookie = cookies.get("AuthCookie");

  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    const result = moderationService.aiConnectionTest();
    console.log({result});
  }, []);

  if (!cookie) return;
  const decodedCookie = jwtDecode<TokenPayload>(cookie);

  const handleTextChange = (value: string) => {
    setTextValue(value);
  }

  const submitTextInput = async () => {
    try {
      const textInput = await moderationService.createAndProcessTextInput(decodedCookie.id, textValue);
      console.log(textInput);
    } catch (error) {
      console.error("Error moderating text input", error);
    }
  }


  return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline/>
        <Box sx={{display: "flex", minHeight: "100vh"}}>
          <SideBar/>
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

              <Paper sx={{width: 1500, height: 125, borderRadius: 5, backgroundColor: "background.paper"}}>
                <Typography sx={{display: 'flex', alignItems: 'center', paddingLeft: 2}}
                            variant="h4">
                  Step 1
                  <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'flex-end', paddingRight: 3, paddingTop: 3}}>
                    <CircularProgress/>
                    <CheckCircleIcon sx={{height: 50, width: 50, color: "green"}}/>
                    <CancelIcon sx={{height: 50, width: 50, color: "red"}}/>
                  </Box>
                </Typography>
                <Typography sx={{ paddingLeft: 2}} variant="h6">
                  Moderation check - Bad Words
                </Typography>

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
                <img src={"../IconLogo.png"} alt="logo" width="86px" height="86px"/>
                <Typography variant="h5" sx={{mt: 1}}>
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
                    style={{width: 800}}
                    variant="outlined"
                    placeholder="Write text input here..."
                    multiline={true}
                    maxRows={4}
                    onBlur={(e) => {
                      handleTextChange(e.target.value)
                    }}
                />
                <IconButton
                    color="primary"
                    size="large"
                    sx={{ml: 1, alignSelf: "flex-start"}}
                    onClick={() => submitTextInput()}
                >
                  <SendIcon/>
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
  );
};
