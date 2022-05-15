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
import YupPassword from 'yup-password';
YupPassword(Yup); // extend yup
import { getError } from '../utils/error';
import Cookies from 'js-cookie';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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
  const { redirect } = router.query;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPhoneInfo, setShowPhoneInfo] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isLowerCase, setIsLowerCase] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isSymbol, setIsSymbol] = useState(false);

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

  const passwordHintHandler = (e) => {
    const uppercase = new RegExp('(?=.*[A-Z])');
    const lowercase = new RegExp('(?=.*[a-z])');
    const number = new RegExp('(?=.*\\d)');
    const symbol = new RegExp('(?=.*[(-+~:=_!@#$%^&*.,?)])');

    uppercase.test(e.target.value)
      ? setIsUpperCase(true)
      : setIsUpperCase(false);
    lowercase.test(e.target.value)
      ? setIsLowerCase(true)
      : setIsLowerCase(false);
    number.test(e.target.value) ? setIsNumber(true) : setIsNumber(false);
    symbol.test(e.target.value) ? setIsSymbol(true) : setIsSymbol(false);
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
      if (data) {
        Cookies.set('userInfo', JSON.stringify(data));
        router.push('/verify_email');

        return enqueueSnackbar(
          `Please check your email to complete your registration.`,
          {
            variant: 'success',
          }
        );
      }
    } catch (err) {
      setLoading(false);
      return enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title='Register'>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component='h1' variant='h1'>
          Create an Account
        </Typography>
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
                  onFocus={() => setShowPhoneInfo(true)}
                  onBlur={() => setShowPhoneInfo(false)}
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
          {showPhoneInfo ? (
            <ListItem>
              <Typography
                variant='h6'
                style={{ margin: 0, fontSize: '0.7rem' }}
              >
                <span style={{ listStyleType: 'circle' }}>e.g. 9081234567</span>
              </Typography>
            </ListItem>
          ) : null}

          <ListItem>
            <Controller
              name='password'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  variant='standard'
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
                    <HighlightOffIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#ff0000' }}
                    />
                  ) : (
                    <CheckCircleOutlineIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#00ff00' }}
                    />
                  )}
                  <Typography
                    variant='h6'
                    style={{
                      margin: '0 0 0 5px',
                      fontSize: '0.7rem',
                      color: inputValue.length < 8 ? '#ff0000' : '#00ff00',
                    }}
                  >
                    Length must be at least 8 characters
                  </Typography>
                </span>
                <span style={{ display: 'flex', margin: 0 }}>
                  {isUpperCase ? (
                    <CheckCircleOutlineIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#00ff00' }}
                    />
                  ) : (
                    <HighlightOffIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#ff0000' }}
                    />
                  )}
                  <Typography
                    variant='h6'
                    style={{
                      margin: '0 0 0 5px',
                      fontSize: '0.7rem',
                      color: isUpperCase ? '#00ff00' : '#ff0000',
                    }}
                  >
                    Must contain one uppercase letter
                  </Typography>
                </span>
                <span style={{ display: 'flex', margin: 0 }}>
                  {isLowerCase ? (
                    <CheckCircleOutlineIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#00ff00' }}
                    />
                  ) : (
                    <HighlightOffIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#ff0000' }}
                    />
                  )}
                  <Typography
                    variant='h6'
                    style={{
                      margin: '0 0 0 5px',
                      fontSize: '0.7rem',
                      color: isLowerCase ? '#00ff00' : '#ff0000',
                    }}
                  >
                    Must contain one lowercase letter
                  </Typography>
                </span>
                <span style={{ display: 'flex', margin: 0 }}>
                  {isNumber ? (
                    <CheckCircleOutlineIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#00ff00' }}
                    />
                  ) : (
                    <HighlightOffIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#ff0000' }}
                    />
                  )}
                  <Typography
                    variant='h6'
                    style={{
                      margin: '0 0 0 5px',
                      fontSize: '0.7rem',
                      color: isNumber ? '#00ff00' : '#ff0000',
                    }}
                  >
                    Must contain one number
                  </Typography>
                </span>
                <span style={{ display: 'flex', margin: 0 }}>
                  {isSymbol ? (
                    <CheckCircleOutlineIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#00ff00' }}
                    />
                  ) : (
                    <HighlightOffIcon
                      fontSize='small'
                      style={{ fontSize: '1rem', color: '#ff0000' }}
                    />
                  )}
                  <Typography
                    variant='h6'
                    style={{
                      margin: '0 0 0 5px',
                      fontSize: '0.7rem',
                      color: isSymbol ? '#00ff00' : '#ff0000',
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
            Login
          </Typography>
        </Link>
      </NextLink>
    </Layout>
  );
};

export default Register;
