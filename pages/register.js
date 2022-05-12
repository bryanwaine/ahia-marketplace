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
import IconButton from '@mui/material/IconButton';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { getError } from '../utils/error';
import Cookies from 'js-cookie';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Register = () => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .min(2, 'First Name is not valid'),
    lastName: Yup.string()
      .required('Last Name is required')
      .min(2, 'Last Name is not valid'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is not valid'),
    phone: Yup.string()
      .min(10, `Phone number should be 10 digits excluding the first '0'`)
      .max(10, `Phone number should be 10 digits excluding the first '0'`),
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
  const { redirect } = router.query;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitHandler = async ({
    firstName,
    lastName,
    email,
    phone,
    password,
  }) => {
    try {
      closeSnackbar();
      setLoading(true);
      const { data } = await axios.post('/api/users/register', {
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      Cookies.set('userInfo', JSON.stringify(data));      
      router.push('/verify_email');
      
      enqueueSnackbar(`Please check your email to complete your registration.`, {
        variant: 'success',
      });
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title='Register'>
      <Typography component='h1' variant='h1'>
          Create an Account
        </Typography>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        
        <List>
          <ListItem>
            <Controller
              name='firstName'
              control={control}
              defaultValue=''
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
                  id='firstName'
                  label='First Name'
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='lastName'
              control={control}
              defaultValue=''
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
                  id='lastName'
                  label='Last Name'
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='email'
              control={control}
              defaultValue=''
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
                  helperText={errors.email?.message}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem className={classes.flexNumDiv}>
            <div className={classes.prefix}>
              <Typography
                variant='h6'
                style={{ margin: 0 }}
                className={classes.prefixTop}
              >
                Prefix
              </Typography>
              <Typography style={{ margin: 0 }} variant='h6'>
                +234
              </Typography>
            </div>
            <Controller
              name='phone'
              control={control}
              defaultValue=''
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
                  id='phone'
                  label='Phone Number'
                  inputProps={{ inputComponent: NumberFormatCustom }}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
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
                CREATE ACCOUNT
              </Button>
            )}
          </ListItem>
        </List>
      </form>
        <Typography variant='h6' className={classes.centeredText}>
          Already have an account? &nbsp;{' '}
        </Typography>
        <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
          <Link>
            <Typography variant='h6' className={classes.centeredLink}>
              SIGN IN
            </Typography>
          </Link>
        </NextLink>
    </Layout>
  );
};

export default Register;
