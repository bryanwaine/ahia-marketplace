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
import Countdown from 'react-countdown';

const VerifyEmail = () => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    verificationCode: Yup.string(),
    // .required('Verification code is required')
    // .min(6, 'Verification code must be 6 characters')
    // .max(6, 'Verification code must be 6 characters'),
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
  const { dispatch } = useContext(Store);
  // const { userInfo } = state;
  const classes = useStyles();
  const [loading, setLoadingVerify] = useState(false);
  const [userInfoEmail, setUserInfoEmail] = useState('');
  const [waitToResend, setWaitToResend] = useState(false);
const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    // if (userInfo && userInfo.isEmailVerified) {
    //   router.push('/');
    // }
    // if (userInfo && !userInfo.isEmailVerified) {
    //   setValue('email', userInfo.email);
    // }
    const userInfo = JSON.parse(Cookies.get('userInfo'));
    setUserInfoEmail(userInfo.email);
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
      const { data } = await axios.patch('/api/users/register', {
        email,
        verificationCode,
      });
      // Cookies.set('userInfo', JSON.stringify(data));
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

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      setWaitToResend(false);
      return null;
    } else {
      // Render a countdown
      return (
        <span>
          {minutes}:{seconds}
        </span>
      );
    }
  };

  const resendCodeHandler = async () => {
    try {
      const email = userInfoEmail;
      setWaitToResend(true);
      await axios.patch('/api/users/login', {
        email,
      });
      enqueueSnackbar(
        `Please check your email to complete your registration.`,
        {
          variant: 'success',
        }
      );
    } catch (err) {
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
              <br /> <strong>{userInfoEmail || `your email address`}</strong>
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
                      maxLength: 6,
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
                  onInput={(e) => setInputValue(e.target.value)}
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
                disabled={inputValue.length === 6 ? false : true}
              >
                VERIFY EMAIL
              </Button>
            )}
          </ListItem>
          <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
            {waitToResend ? (
              <Button variant='text' disabled>
                <Typography variant='h6' style={{ margin: 0 }}>
                  Resend code in&nbsp;
                  {<Countdown date={Date.now() + 59000} renderer={renderer} />}<span style={{textTransform: 'lowercase'}}>s</span>
                </Typography>
              </Button>
            ) : (
              <Button variant='text' onClick={() => resendCodeHandler()}>
                <Typography
                  variant='h6'
                  style={{ margin: 0, color: '#ff0000' }}
                >
                  Resend code
                </Typography>
              </Button>
            )}
          </ListItem>
        </List>
      </form>
      <Typography variant='h6'>
        <span style={{ color: '#666666' }}>
          (Did not get the code? Check your spam folder. Be sure to include our email address in your address book to
          prevent our emails from going to your spam folder.)
        </span>
      </Typography>
    </Layout>
  );
};

export default VerifyEmail;
