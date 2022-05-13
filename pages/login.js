import {
  Button,
  CircularProgress,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import IconButton from '@mui/material/IconButton';
import dynamic from 'next/dynamic';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitHandler = async ({ email, password }) => {
    try {
      closeSnackbar();
      setLoading(true);
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      if (!data.isEmailVerified) {
        await axios.patch('/api/users/login', {
          email,
        });
        await Cookies.set('userInfo', JSON.stringify(data));
        router.push(`/verify_email`);
        enqueueSnackbar(
          `Please check your email to complete your registration.`,
          {
            variant: 'success',
          }
        );
        return;
      } else {
        enqueueSnackbar(`Welcome back, ${data.firstName}`, {
          variant: 'success',
        });
        dispatch({ type: 'USER_LOGIN', payload: data });
        Cookies.set('userInfo', JSON.stringify(data));
        router.push(redirect || '/');
      }
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title='Login'>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component='h1' variant='h1'>
          Sign In
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='email'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  InputProps={{
                    style: { fontSize: '0.8rem', fontWeight: 300 },
                  }}
                  InputLabelProps={{
                    style: { fontSize: '0.8rem', fontWeight: 300 },
                  }}
                  variant='standard'
                  fullWidth
                  id='email'
                  label='Email'
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : null
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='password'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant='standard'
                  fullWidth
                  id='password'
                  label='Password'
                  autoComplete='new-password'
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password is too short'
                        : 'Password is required'
                      : null
                  }
                  {...field}
                  InputProps={{
                    style: { fontSize: '0.8rem', fontWeight: 300 },
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge='end'
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    type: showPassword ? 'text' : 'password',
                  }}
                  InputLabelProps={{
                    style: { fontSize: '0.8rem', fontWeight: 300 },
                  }}
                />
              )}
            />
          </ListItem>
          <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
            {loading ? (
              <div className={classes.buttonLoading}>
                <CircularProgress />
              </div>
            ) : (
              <Button
                fullWidth
                variant='contained'
                className={classes.buttonPrimary}
                color='primary'
                type='submit'
              >
                SIGN IN
              </Button>
            )}
          </ListItem>
        </List>
        <NextLink href={`/forgot_password`} passHref>
          <Link>
            <Typography
              variant='h6'
              className={classes.centeredText}
              style={{ color: '#ff0000' }}
            >
              Forgot password?
            </Typography>
          </Link>
        </NextLink>
        <Typography variant='h6' className={classes.centeredText}>
          New to Ahịa? &nbsp;{' '}
        </Typography>
        <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
          <Link>
            <Typography variant='h6' className={classes.centeredLink}>
              CREATE AN ACCOUNT
            </Typography>
          </Link>
        </NextLink>
      </form>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Login), { ssr: false });
