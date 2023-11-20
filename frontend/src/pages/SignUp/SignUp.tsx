import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ThemeProvider} from '@mui/material/styles';
import {useState} from "react";
import {Alert, CircularProgress, Snackbar} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {defaultTheme} from "../../assets/theme.ts";
import {Copyright} from "../../components/copyright.tsx";
import {UserService} from "../../services/UserService.ts";
import "./SignUp.css"


export default function SignUp() {

  const navigate = useNavigate();
  const userService = new UserService();

  const [passwordValue, setPasswordValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handlePasswordValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const {firstName, lastName, email, username, password, passwordRepeat} = Object.fromEntries(formData);

      if (!firstName || !lastName || !email || !username) {
        throw new Error('Please fill out all fields');
      } else if (!password) {
        throw new Error('Please insert a password');
      } else if (password !== passwordRepeat) {
        throw new Error('Passwords do not match, please try again');
      } else if (!isChecked) {
        throw new Error('Please agree to the terms and conditions to continue');
      }

      await userService.register({
        firstName: firstName as string,
        lastName: lastName as string,
        email: email as string,
        username: username as string,
        password: password as string,
      });

      setTimeout(() => {
        setOpenSnackbar(true);
        setLoading(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
      // @ts-ignore
      setErrorMessage(error.message);
      console.error(error);
    }
  };


  return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline/>
          <Box className="containerBox">
            <img src={"../Logo.png"} alt={"description"} className={"logoImg"}/>
          </Box>
          <Box className="containerBox">
            <Avatar className="avatar" sx={{backgroundColor: 'primary.main'}}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{marginTop: 3}}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={passwordValue}
                      onChange={handlePasswordValueChange}
                  />
                </Grid>
                {passwordValue && (
                    <Grid item xs={12}>
                      <TextField
                          required
                          fullWidth
                          name="passwordRepeat"
                          label="Repeat password"
                          type="password"
                          id="passwordRepeat"
                          autoComplete="new-password"
                      />
                    </Grid>
                )}
              </Grid>
              <Grid item xs={12}>
                {errorMessage && (
                    <Grid item xs={12} className="errorMessageGrid">
                      <Alert severity="error">{errorMessage}</Alert>
                    </Grid>
                )}

                <Typography className="formControlTypography">
                  <FormControlLabel
                      control={
                        <Checkbox
                            value="allowExtraEmails"
                            color="primary"
                            onChange={(event) => setIsChecked(event.target.checked)}
                            checked={isChecked}
                        />}
                      label={"I agree to the"}
                  />
                  <Link marginLeft={-1.5} marginTop={1}
                        href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"} target="_blank">
                    Terms and Conditions
                  </Link>
                  {loading && <CircularProgress size={32} className="circularProgress"/>}
                </Typography>
              </Grid>
              <Grid className="submitButtonGrid">
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                >
                  Sign Up
                </Button>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/Login" variant="body2">
                    Already have an account? Sign in
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
                navigate("/login")
                setOpenSnackbar(false)
              }}
              message="You have been signed up and will be redirected to login"
          />
        </Container>
      </ThemeProvider>
  );
}