import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';

import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Facebook as FacebookIcon } from '../icons/facebook';
import { Google as GoogleIcon } from '../icons/google';
import { Alert } from '@mui/material';

const host = 'https://rendezvous2022.herokuapp.com';

const Login = () => {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required(
          'username is required'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required')
    }),
    onSubmit: async () => {
      var body = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      }
      let response = await fetch(`${host}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      let json = await response.json()
      if (response.status !== 200) {
        //alert(json.error);  //invalid login error
        setOpen2(true);
      } else {
        localStorage.setItem('user', JSON.stringify(json));
        //alert('Login Successful')
        setOpen(true);

        router.push('/');
      }
    }
  });

  return (
    <>
      <Head>
        <title>Login | Rendezvous</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Go To Home Page
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                pb: 1,
                pt: 3
              }}
            >
              <Typography
                align="center"
                color="textSecondary"
                variant="body1"
              >
                Login with Username
              </Typography>
            </Box>
            <TextField
              id='username'
              error={Boolean(formik.touched.text && formik.errors.text)}
              fullWidth
              helperText={formik.touched.text && formik.errors.text}
              label="Username"
              margin="normal"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.username}
              variant="outlined"
            />
            <TextField
              id='password'
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Don&apos;t have an account?
              {' '}
              <NextLink
                href="/register"
              >
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
      <div>

        <Snackbar
          open={open}
          autoHideDuration={600}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Login Successful
          </Alert>
        </Snackbar>
        <Snackbar
          open={open2}
          autoHideDuration={6000}>
          <Alert severity="error" sx={{ width: '100%' }}>
            Incorrect Credentials
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Login;
