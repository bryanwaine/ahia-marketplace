import {
  Button,
  Card,
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
import NoLayout from '../components/NoLayout';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LockIcon from '@mui/icons-material/Lock';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

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
      .min(11, `Phone number should be 11 digits`)
      .max(11, `Phone number should be 11 digits`),
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
    const symbol = new RegExp('(?=.*[(\\-+~:=/_\\\\!@#$%^&*.,?)])');

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
    <NoLayout title='Register'>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Card raised={true}>
          <List>
            <ListItem>
              <Typography component='h1' variant='h1'>
                Create an Account
              </Typography>
            </ListItem>
            <ListItem>
              <Controller
                name='firstName'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    InputProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                      startAdornment: (
                        <InputAdornment position='start'>
                          <IconButton>
                            <PersonIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                    }}
                    variant='outlined'
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
                      startAdornment: (
                        <InputAdornment position='start'>
                          <IconButton>
                            <PersonAddAlt1Icon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                    }}
                    variant='outlined'
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
                      startAdornment: (
                        <InputAdornment position='start'>
                          <IconButton>
                            <MailIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                    }}
                    variant='outlined'
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
              <Controller
                name='phone'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    InputProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                      startAdornment: (
                        <InputAdornment position='start'>
                          <IconButton>
                            <PhoneIphoneIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                    }}
                    variant='outlined'
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
                          <IconButton>
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
                    <Typography
                      variant='h6'
                      style={{
                        margin: '0 0 0 5px',
                        fontSize: '0.7rem',
                        color: '#aaaaaa',
                      }}
                    >
                      Your password must contian:
                    </Typography>
                  </span>
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
                      8 characters minimum
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
                      uppercase letters
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
                      lowercase letters
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
                      numbers
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
                      special characters
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
                  CREATE ACCOUNT
                </Button>
              )}
            </ListItem>
          </List>
        </Card>
      </form>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      </div>
    </NoLayout>
  );
};

export default Register;
