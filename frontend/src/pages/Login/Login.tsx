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
import {useState} from "react";
import {Alert, CircularProgress} from "@mui/material";

export default function Login() {

  const navigate = useNavigate();
  const userService = new UserService();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const {email, password} = Object.fromEntries(formData);

      if (!email || !password) {
        setLoading(false)
        setErrorMessage('Email or password is incorrect, please try again');
      }


      await userService.login({
        email: email as string,
        password: password as string,
      });

      setTimeout(() => {
        setLoading(false);
        navigate("/home")
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
          <Box sx={{
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <img src={"../public/Logo.png"} alt={"description"} style={{width: "110%", height: "110%"}}/>
          </Box>
          <Box
              sx={{
                marginTop: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
          >
            <Avatar sx={{margin: 1, backgroundColor: 'primary.main'}}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{marginTop: 1}}>
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
                  control={<Checkbox value="remember" color="primary"/>}
                  label="Remember me"
              />
              {loading && <CircularProgress size={32} style={{marginTop: 5, marginLeft: 200}}/>}

              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{marginTop: 1, marginBottom: 2, backgroundColor: 'primary.main'}}
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
          <Box sx={{marginTop: 6, marginBottom: 4}}>
            <Copyright/>
          </Box>

        </Container>
      </ThemeProvider>
  );
}
