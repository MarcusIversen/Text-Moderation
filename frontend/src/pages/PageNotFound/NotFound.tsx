import React from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { defaultTheme } from "../../assets/theme.ts";
import "./NotFound.css";

export const NotFound: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" style={{ overflow: "hidden" }}>
        <CssBaseline />
        <Box className={"containerBox"}>
          <Avatar className="avatar" sx={{ backgroundColor: "secondary.main" }}>
            <ReportGmailerrorredIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="error">
            404
          </Typography>
          <Typography variant="h4">Oops! Page not found.</Typography>
          <Typography variant="body1" className={"heading"}>
            We are sorry but the page you are looking for does not exist.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            className={"button"}
            onClick={handleBackHome}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
