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
import { ThemeProvider } from '@mui/material/styles';
import {defaultTheme} from "../../assets/theme.ts";
import {Copyright} from "../../components/copyright.tsx";
import {UserService} from "../../services/UserService.ts";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Alert, CircularProgress, Snackbar} from "@mui/material";

export default function Login() {

  const navigate = useNavigate();
  const userService = new UserService();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const { email, password } = Object.fromEntries(formData);

      if (!email || !password) {
        throw new Error('Email or password is incorrect, please try again');
      }

      console.log("response: " , email as string, " , " , password as string)
      console.log("you did not pass it")

      await userService.login({
        email: email as string,
        password: password as string,
      });

      console.log("you did pass it")
      // Redirect or perform any action after successful login
      navigate('/home');
    } catch (error) {
      setLoading(false);
      // @ts-ignore
      setErrorMessage(error.message);
      console.error(error);
    }
  };

  return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs" style={{overflow: "hidden"}}>
          <CssBaseline />
          <Box sx={{
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <img src={"../public/Logo.png"} alt={"description"} style={{width: "120%", height: "120%"}}/>
          </Box>
          <Box
              sx={{
                marginTop: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
          >
            <Avatar sx={{ margin: 1, backgroundColor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ marginTop: 1 }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
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
              />
              {errorMessage && (
                  <Grid item xs={12} marginTop={2}>
                    <Alert severity="error">{errorMessage}</Alert>
                  </Grid>
              )}
              <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
              />
              {loading && <CircularProgress size={32} style={{marginTop: 10, marginLeft: 35}}/>}

              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ marginTop: 1, marginBottom: 2, backgroundColor: 'primary.main' }}
              >
                Sign In
              </Button>
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
          <Box sx={{ marginTop: 6, marginBottom: 4 }}>
            <Copyright />
          </Box>
          <Snackbar
              open={openSnackbar}
              autoHideDuration={3500}
              onClose={() => {
                navigate("/login")
                setOpenSnackbar(false)}}
              message="You have been signed in and will be redirected to login"
          />
        </Container>
      </ThemeProvider>
  );
}
