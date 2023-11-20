import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ThemeProvider} from '@mui/material/styles';
import {defaultTheme} from "../../assets/theme.ts";
import {Copyright} from "../../components/copyright.tsx";
import {UserService} from "../../services/UserService.ts";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, useEffect, useState} from "react";
import {Alert, CircularProgress, Snackbar} from "@mui/material";
import {jwtDecode} from "jwt-decode";
import "./Login.css";

export default function Login() {

  const navigate = useNavigate();
  const userService = new UserService();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);

      // @ts-ignore
      setEmail(decodedToken.email);
      setPassword("passwordfill");
      setRememberMe(true);

      setLoading(true);
      setOpenSnackbar(true);

      setTimeout(() => {
        setLoading(false);
        setOpenSnackbar(false)
        navigate("/home");
      }, 3500);
    }
  }, []);


  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const {email, password} = Object.fromEntries(formData);

      if (!email || !password) {
        setLoading(false);
        setErrorMessage('Email or password is incorrect, please try again');
      }

      const token = await userService.login({
        email: email as string,
        password: password as string,
      });

      if (rememberMe) {
        localStorage.setItem("token", token.token);
      }

      setTimeout(() => {
        setLoading(false);
        navigate("/home");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setErrorMessage('Email or password is incorrect, please try again');
      console.error(error);
    }
  };


  return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs" style={{overflow: "hidden"}}>
          <CssBaseline/>
          <Box className={"containerBox"}>
            <img src={"../Logo.png"} alt={"description"} className={"logoImg"}/>
          </Box>
          <Box className={"containerBox"}>
            <Avatar className="avatar" sx={{backgroundColor: 'primary.main'}}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" className="formBox" onSubmit={handleSubmit} noValidate>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Handle changes to the email field
              />
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && (
                  <Grid item xs={12} className="errorMessageGrid">
                    <Alert severity="error">{errorMessage}</Alert>
                  </Grid>
              )}
              <FormControlLabel
                  control={<Checkbox value="remember"
                                     color="primary"
                                     checked={rememberMe}
                                     onChange={handleCheckboxChange}/>}
                  label="Remember me"
              />
              {loading && <CircularProgress size={32} style={{marginLeft: 200, marginTop: 10}}/>}

              <Grid className="submitButtonGrid">
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="submitButton"
                    sx={{backgroundColor: 'primary.main'}}
                >
                  Sign In
                </Button>
              </Grid>

              <Grid container>
                <Grid item xs>
                  <Link href="/create-new-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/sign-up" variant="body2">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box className="copyrightBox">
            <Copyright/>
          </Box>
          <Snackbar
              open={openSnackbar}
              autoHideDuration={3500}
              onClose={() => {
                navigate("/home")
                setOpenSnackbar(false)
              }}
              message="You have been remembered, and will now be signed in"
          />
        </Container>
      </ThemeProvider>
  );
}
