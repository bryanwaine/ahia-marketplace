import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';

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

const Profile = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      setValue('firstName', userInfo.firstName);
      setValue('lastName', userInfo.lastName);
      setValue('email', userInfo.email);
      setValue('phone', userInfo.phone);
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
      const { data } = await axios.put(
        '/api/users/profile',
        {
          firstName,
          lastName,
          email,
          phone,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      setLoading(false);
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      enqueueSnackbar(`Profile updated successfully!`, {
        variant: 'success',
      });
    } catch (err) {
      closeSnackbar();
      enqueueSnackbar(getError(err), { variant: 'error' });
      setLoading(false);
    }
  };

  return (
    <Layout title='Profile' selectedNavPerson>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12} className={classes.gridHide}>
          <Card className={classes.section}>
            <List>
              <NextLink href='/profile'>
                <ListItem button component='a' selected>
                  <ListItemText
                    disableTypography={true}
                    primary='Profile'
                  ></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href='/order_history'>
                <ListItem button component='a'>
                  <ListItemText
                    disableTypography={true}
                    primary='Order History'
                  ></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <form
              onSubmit={handleSubmit(submitHandler)}
              className={classes.form}
            >
              <Typography
                component='h1'
                variant='h1'
                style={{ marginLeft: 10 }}
              >
                Profile
              </Typography>
              <List>
                <ListItem>
                  <Controller
                    name='firstName'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                      minLength: 2,
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
                        id='firstName'
                        label='First Name'
                        inputProps={{ type: 'text' }}
                        error={Boolean(errors.firstName)}
                        helperText={
                          errors.firstName
                            ? errors.firstName.type === 'minLength'
                              ? 'First Name is not valid'
                              : 'First Name is required'
                            : null
                        }
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
                    rules={{
                      required: true,
                      minLength: 2,
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
                        id='lastName'
                        label='Last Name'
                        inputProps={{ type: 'text' }}
                        error={Boolean(errors.lastName)}
                        helperText={
                          errors.lastName
                            ? errors.lastName.type === 'minLength'
                              ? 'Last Name is not valid'
                              : 'Last Name is required'
                            : null
                        }
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
                <ListItem className={classes.flexNumDiv}>
                  <div className={classes.prefix}>
                    <Typography
                      className={classes.prefixTop}
                      variant='h6'
                      style={{ margin: 0 }}
                    >
                      Prefix
                    </Typography>
                    <Typography variant='h6' style={{ margin: 0 }}>
                      +234
                    </Typography>
                  </div>
                  <Controller
                    name='phone'
                    control={control}
                    defaultValue=''
                    rules={{
                      minLength: 10,
                      maxLength: 10,
                      pattern: /[0-9]{10}/,
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
                        id='phone'
                        label='Phone Number'
                        inputProps={{ inputComponent: NumberFormatCustom }}
                        error={Boolean(errors.phone)}
                        helperText={
                          errors.phone
                            ? errors.phone.type === 'pattern'
                              ? `Only digits are allowed`
                              : `Phone number should be 10 digits excluding the first '0'`
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
                      validate: (value) =>
                        value === '' ||
                        value.length > 6 ||
                        'Password must be at least 6 characters',
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
                            ? 'Password must be at least 6 characters'
                            : ''
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
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
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
                    rules={{
                      validate: (value) =>
                        value === '' ||
                        value.length > 6 ||
                        'Password must be at least 6 characters',
                    }}
                    render={({ field }) => (
                      <TextField
                        variant='standard'
                        fullWidth
                        id='confirmPassword'
                        label='Confirm Password'
                        error={Boolean(errors.confirmPassword)}
                        helperText={
                          errors.password
                            ? 'Password must be at least 6 characters'
                            : ''
                        }
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
                      UPDATE
                    </Button>
                  )}
                </ListItem>
              </List>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
