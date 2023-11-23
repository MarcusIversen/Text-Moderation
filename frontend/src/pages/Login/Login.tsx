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
import {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {Alert, CircularProgress, Snackbar} from "@mui/material";
import {JwtPayload, jwtDecode} from "jwt-decode";
import "./Login.css";
import Cookies from "universal-cookie";

interface TokenPayload extends JwtPayload {
  email: string;
}

export const Login: React.FunctionComponent = () => {

  const userService = new UserService();
  const navigate = useNavigate()
  const cookies = useMemo(() => new Cookies(), []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const setAuthCookieWithExpiryDate = useCallback((token: string) => {
    const date = new Date();
    date.setTime(date.getTime() + (45 * 60 * 1000)); // 45 minutes from now
    cookies.set("AuthCookie", token, {expires: date});
  }, [cookies]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const cookie = cookies.get("AuthCookie");

    if (token || token && cookie) {
      const decodedToken = jwtDecode<TokenPayload>(token);

      if (!cookie) {
        setAuthCookieWithExpiryDate(token)
      }

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
    } else if (cookie || cookie && !token) {
      navigate("/home");
    }
  }, [navigate, cookies, setAuthCookieWithExpiryDate]);


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

      if (token) {
        setAuthCookieWithExpiryDate(token.token)
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
        <Container style={{display: 'flex', justifyContent: 'center'}}>
          <img src={"../Logo.png"} alt={"description"} className={"logoImg"}/>
        </Container>
        <Container component="main" maxWidth="xs" style={{overflow: "hidden", marginTop: -40}}>
          <CssBaseline/>
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
            <Box className="copyrightBox">
              <Copyright/>
            </Box>
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
