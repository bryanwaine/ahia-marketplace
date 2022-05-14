import {
  Button,
  CircularProgress,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import React, {useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { getError } from '../utils/error';

const Reset_password = () => {

  // form validation rules
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(10, 'Password must be at least 10 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

     const formOptions = { resolver: yupResolver(validationSchema) };

     const {
       handleSubmit,
       control,
       formState: { errors },
     } = useForm(formOptions);
     const { enqueueSnackbar, closeSnackbar } = useSnackbar();
     const router = useRouter();
     const classes = useStyles();
     const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = router.query.token
    const id = router.query.id
    
    const submitHandler = async ({ password}) => {
      try {
        closeSnackbar();
        setLoading(true);
        await axios.patch('/api/users/reset_password', {
            password,
            token,
            id
        });

        enqueueSnackbar(`Password reset successfully. Sign in`, {
          variant: 'success',
        });
        return router.push('/login');
      } catch (err) {
        setLoading(false);
        return enqueueSnackbar(getError(err), { variant: 'error' });
      }
    };

     const handleClickShowPassword = () => {
       setShowPassword(!showPassword);
     };

     const handleClickShowConfirmPassword = () => {
       setShowConfirmPassword(!showConfirmPassword);
     };

     const handleMouseDownPassword = (event) => {
       event.preventDefault();
     };

    return (
      <Layout title='Register'>
        <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
          <Typography component='h1' variant='h1'>
            Reset your password
          </Typography>
          <List>
            <ListItem>
              <Controller
                name='password'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    variant='standard'
                    fullWidth
                    id='password'
                    label='Password'
                    autoComplete='new-password'
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
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
            <ListItem>
              <Controller
                name='confirmPassword'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    variant='standard'
                    fullWidth
                    id='confirmPassword'
                    label='Confirm Password'
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword?.message}
                    {...field}
                    InputProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      type: showConfirmPassword ? 'text' : 'password',
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
                  SUBMIT
                </Button>
              )}
            </ListItem>
          </List>
        </form>
      </Layout>
    );
};

export default Reset_password;
