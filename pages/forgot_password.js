import {
  Button,
  CircularProgress,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getError } from '../utils/error';
import { fnOsDetect, fnBrowserDetect } from '../utils/deviceDetect';

const Forgot_password = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [os, setOs] = useState('');
  const [browser, setBrowser] = useState('');
  const router = useRouter();

  useEffect(() => {
    setBrowser(fnBrowserDetect());
    setOs(fnOsDetect());
  }, []);

  const submitHandler = async ({ email }) => {
    try {
      closeSnackbar();
      setLoading(true);
      await axios.patch('/api/users/request_password_reset', {
        email,
        os,
        browser,
      });

      enqueueSnackbar(`Check your email for further instructions.`, {
        variant: 'success',
      });
      const id = `8449baac55aec3d18e96b1dd8f4f49903d79f353d26046d932c4e22448e4d0de47983b8c0ef746a9a4d62b7c4a19809c1c47cc5831970bd20a75f92900f5014c408382049f0598ce85e093`;
      return router.push(`/check_email_${id}`);
    } catch (err) {
      setLoading(false);
      return enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title='Forgot your password?'>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component='h1' variant='h1'>
          Forgot your Password?
        </Typography>

        <List>
          <ListItem>
            <Typography variant='h6' className={classes.centeredText}>
              Enter the email address used in registration.
            </Typography>
          </ListItem>
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
                Submit
              </Button>
            )}
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Forgot_password;
