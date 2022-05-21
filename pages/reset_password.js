import {
  Button,
  Card,
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
import React, { useState } from 'react';
import NoLayout from '../components/NoLayout';
import useStyles from '../utils/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(Yup); // extend yup
import { getError } from '../utils/error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';

const Reset_password = () => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    password: Yup.string().password().required('Password is required'),
    confirmPassword: Yup.string()
      .password()
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
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isLowerCase, setIsLowerCase] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isSymbol, setIsSymbol] = useState(false);
  const token = router.query.token;
  const id = router.query.id;

  const passwordHintHandler = (e) => {
    const uppercase = new RegExp('(?=.*[A-Z])');
    const lowercase = new RegExp('(?=.*[a-z])');
    const number = new RegExp('(?=.*\\d)');
    const symbol = new RegExp('(?=.*[(-+~:=\\-_!@#$%^&*.,?)])');

    uppercase.test(e.target.value)
      ? setIsUpperCase(true)
      : setIsUpperCase(false);
    lowercase.test(e.target.value)
      ? setIsLowerCase(true)
      : setIsLowerCase(false);
    number.test(e.target.value) ? setIsNumber(true) : setIsNumber(false);
    symbol.test(e.target.value) ? setIsSymbol(true) : setIsSymbol(false);
  };

  const submitHandler = async ({ password }) => {
    try {
      closeSnackbar();
      setLoading(true);
      await axios.patch('/api/users/reset_password', {
        password,
        token,
        id,
      });

      enqueueSnackbar(`Password reset successfully.`, {
        variant: 'success',
      });
      return router.push('/login');
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
      return router.push(
        '/link_expired_8449baac55aec3d18e96b1dd8f4f49903d79f353d26046d932c4e22448e4d0de47983b8c0ef746a9a4d62b7c4a19809c1c47cc5831970bd20a75f92900f5014c408382049f0598ce85e093'
      );
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
    <NoLayout title='Register'>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Card raised={true}>
          <List>
            <ListItem>
              <Typography component='h1' variant='h1'>
                Reset your password
              </Typography>
            </ListItem>
            <ListItem>
              <Controller
                name='password'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    variant='outlined'
                    fullWidth
                    onInput={(e) => {
                      setInputValue(e.target.value);
                      passwordHintHandler(e);
                    }}
                    id='password'
                    label='Password'
                    onFocus={() => setShowPasswordInfo(true)}
                    onBlur={() => setShowPasswordInfo(false)}
                    autoComplete='new-password'
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    {...field}
                    InputProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                      startAdornment: (
                        <InputAdornment position='start'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge='end'
                          >
                            <LockIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
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
            {showPasswordInfo ? (
              <ListItem>
                <div>
                  <span style={{ display: 'flex', margin: 0 }}>
                    {inputValue.length < 8 ? (
                      <CancelIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#ff0000' }}
                      />
                    ) : (
                      <CheckCircleIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#12b370' }}
                      />
                    )}
                    <Typography
                      variant='h6'
                      style={{
                        margin: '0 0 0 5px',
                        fontSize: '0.7rem',
                        color: inputValue.length < 8 ? '#ff0000' : '#12b370',
                      }}
                    >
                      Length must be at least 8 characters
                    </Typography>
                  </span>
                  <span style={{ display: 'flex', margin: 0 }}>
                    {isUpperCase ? (
                      <CheckCircleIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#12b370' }}
                      />
                    ) : (
                      <CancelIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#ff0000' }}
                      />
                    )}
                    <Typography
                      variant='h6'
                      style={{
                        margin: '0 0 0 5px',
                        fontSize: '0.7rem',
                        color: isUpperCase ? '#12b370' : '#ff0000',
                      }}
                    >
                      Must contain one uppercase letter
                    </Typography>
                  </span>
                  <span style={{ display: 'flex', margin: 0 }}>
                    {isLowerCase ? (
                      <CheckCircleIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#12b370' }}
                      />
                    ) : (
                      <CancelIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#ff0000' }}
                      />
                    )}
                    <Typography
                      variant='h6'
                      style={{
                        margin: '0 0 0 5px',
                        fontSize: '0.7rem',
                        color: isLowerCase ? '#12b370' : '#ff0000',
                      }}
                    >
                      Must contain one lowercase letter
                    </Typography>
                  </span>
                  <span style={{ display: 'flex', margin: 0 }}>
                    {isNumber ? (
                      <CheckCircleIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#12b370' }}
                      />
                    ) : (
                      <CancelIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#ff0000' }}
                      />
                    )}
                    <Typography
                      variant='h6'
                      style={{
                        margin: '0 0 0 5px',
                        fontSize: '0.7rem',
                        color: isNumber ? '#12b370' : '#ff0000',
                      }}
                    >
                      Must contain one number
                    </Typography>
                  </span>
                  <span style={{ display: 'flex', margin: 0 }}>
                    {isSymbol ? (
                      <CheckCircleIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#12b370' }}
                      />
                    ) : (
                      <CancelIcon
                        fontSize='small'
                        style={{ fontSize: '1rem', color: '#ff0000' }}
                      />
                    )}
                    <Typography
                      variant='h6'
                      style={{
                        margin: '0 0 0 5px',
                        fontSize: '0.7rem',
                        color: isSymbol ? '#12b370' : '#ff0000',
                      }}
                    >
                      Must contain one symbol (-+~:=_!@#$%^&*.,?)
                    </Typography>
                  </span>
                </div>
              </ListItem>
            ) : null}
            <ListItem>
              <Controller
                name='confirmPassword'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='confirmPassword'
                    label='Confirm Password'
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword?.message}
                    {...field}
                    InputProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                      startAdornment: (
                        <InputAdornment position='start'>
                          <IconButton>
                            <EnhancedEncryptionIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
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
        </Card>
      </form>
    </NoLayout>
  );
};

export default Reset_password;
