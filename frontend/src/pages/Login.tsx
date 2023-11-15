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
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props: any) {
  return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {new Date().getFullYear()}
        {' Copyright © '}
        <Link color="inherit" href="https://github.com/MarcusIversen">
          https://github.com/MarcusIversen
        </Link>{' '}
      </Typography>
  );
}

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4facc3',
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `  
        body {  
          background: linear-gradient(to left, #000000, #0a3d62);  
          height: 100vh; 
          overflow: hidden; 
          margin: 0;  
          background-repeat: no-repeat;  
          background-attachment: fixed;  
        }  
      `,
    },
  },
});

export default function Login() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
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
              <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
              />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ marginTop: 3, marginBottom: 2, backgroundColor: 'primary.main' }}
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
        </Container>
      </ThemeProvider>
  );
}
