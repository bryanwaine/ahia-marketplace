import {
  Button,
  CircularProgress,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { getError } from '../utils/error';

const VerifyEmail = () => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    verificationCode: Yup.string()
      .required('Verification code is required')
      .min(6, 'Verification code must be 6 characters')
      .max(6, 'Verification code must be 6 characters'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm(formOptions);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  const [loading, setLoadingVerify] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.isEmailVerified) {
      router.push('/');
    }
    if (userInfo && !userInfo.isEmailVerified) {
      setValue('email', userInfo.email);
    }
  }, []);

  const verifyEmailHandler = async ({ email, verificationCode }) => {
    try {
      closeSnackbar();
      setLoadingVerify(true);
      const { data } = await axios.put('/api/users/register', {
        email,
        verificationCode,
      });
      Cookies.set('userInfo', JSON.stringify(data));
      dispatch({ type: 'USER_LOGIN', payload: data });
      enqueueSnackbar(`Welcome ${data.firstName}, enjoy your shopping!`, {
        variant: 'success',
      });
      router.push(redirect || '/');
    } catch (err) {
      setLoadingVerify(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title='Register'>
      <Typography component='h1' variant='h1'>
        Complete your registration
      </Typography>
      <form
        onSubmit={handleSubmit(verifyEmailHandler)}
        className={classes.form}
      >
        <List>
          <ListItem style={{ display: 'none' }}>
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
                  disabled={true}
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
            <Typography variant='h6'>
              Please enter the 6-digit code sent to
              <br /> <strong>{userInfo.email}</strong>
            </Typography>
          </ListItem>
          <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
            <Controller
              name='verificationCode'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  InputProps={{
                    inputProps: {
                      style: {
                        fontSize: '2rem',
                        fontWeight: 300,
                        textAlign: 'center',
                        width: '10rem',
                      },
                    },
                  }}
                  variant='outlined'
                  autoFocus={true}
                  autoComplete={false}
                  id='verificationCode'
                  label='Verification Code'
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.verificationCode)}
                  helperText={errors.verificationCode?.message}
                  {...field}
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
                variant='contained'
                className={classes.buttonPrimary}
                color='primary'
                type='submit'
              >
                VERIFY EMAIL
              </Button>
            )}
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default VerifyEmail;
