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
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

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

const Shipping = () => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const classes = useStyles();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    } else {
      setValue(
        'fullName',
        shippingAddress.fullName
          ? shippingAddress.fullName
          : userInfo
          ? `${userInfo.firstName} ${userInfo.lastName}`
          : ''
      );
      setValue(
        'email',
        shippingAddress.email
          ? shippingAddress.email
          : userInfo
          ? userInfo.email
          : ''
      );
      setValue(
        'phone',
        shippingAddress.phone
          ? shippingAddress.phone
          : userInfo
          ? userInfo.phone
          : ''
      );
      setValue('address', shippingAddress.address);
      setValue('city', shippingAddress.city);
      setValue('state', shippingAddress.state);
    }
  }, []);

  const submitHandler = ({ fullName, email, phone, address, city, state }) => {
    setLoading(true);
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        email,
        phone,
        address,
        city,
        state,
      },
    });
    Cookies.set(
      'shippingAddress',
      JSON.stringify({
        fullName,
        email,
        phone,
        address,
        city,
        state,
      })
    );
    router.push('/payment');
  };

  return (
    <Layout title='Shipping Address'>
      <CheckoutWizard activeStep={1} />
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <List>
          <ListItem>
            <Typography component='h1' variant='h1'>
              Shipping Address
            </Typography>
          </ListItem>
          <ListItem>
            <Controller
              name='fullName'
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
                  className={classes.textFieldFont}
                  variant='outlined'
                  fullWidth
                  id='fullName'
                  label='Full Name'
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Full Name is not valid'
                        : 'Full Name is required'
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
            <Controller
              name='phone'
              control={control}
              defaultValue=''
              rules={{
                minLength: 11,
                maxLength: 11,
                pattern: /[0-9]{10}/,
              }}
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
              name='address'
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
                    startAdornment: (
                      <InputAdornment position='start'>
                        <IconButton>
                          <HomeIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { fontSize: '0.8rem', fontWeight: 300 },
                  }}
                  variant='outlined'
                  fullWidth
                  id='address'
                  label='Address'
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'Address is not valid'
                        : 'Address is required'
                      : null
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='city'
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
                    startAdornment: (
                      <InputAdornment position='start'>
                        <IconButton>
                          <LocationCityIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { fontSize: '0.8rem', fontWeight: 300 },
                  }}
                  variant='outlined'
                  fullWidth
                  id='city'
                  label='City'
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City is not valid'
                        : 'City is required'
                      : null
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='state'
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
                    startAdornment: (
                      <InputAdornment position='start'>
                        <IconButton>
                          <LocationOnIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { fontSize: '0.8rem', fontWeight: 300 },
                  }}
                  variant='outlined'
                  fullWidth
                  id='state'
                  label='State'
                  error={Boolean(errors.state)}
                  helperText={
                    errors.state
                      ? errors.state.type === 'minLength'
                        ? 'State is not valid'
                        : 'State is required'
                      : null
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}
          >
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
                Continue
              </Button>
            )}
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Shipping;
