import {
  Button,
  CircularProgress,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getError } from '../utils/error';

const Forgot_password = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitHandler = async ({ email }) => {
    try {
      closeSnackbar();
      setLoading(true);
      await axios.patch('/api/users/reset_password', {
        email,
      });

      enqueueSnackbar(`Check your email for further instructions.`, {
        variant: 'success',
      });
      return router.push('/check_email');
    } catch (err) {
      setLoading(false);
      return enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title='Forgot your password?'>
      
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}><Typography component='h1' variant='h1'>
        Forgot your Password?
      </Typography>
      
        <List>
          <ListItem>
            <Typography variant='h6' className={classes.centeredText}>
        Enter the email address used in registration.
      </Typography>
          </ListItem>
          <ListItem >
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
