import {
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import { useSnackbar } from 'notistack';
import Image from 'next/image';
import paystack from '../public/images/paystack.png';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const Payment = () => {
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);

  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar(`Please select a payment method`, {
        variant: 'error',
      });
    } else {
      setLoading(true);
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/place_order');
    }
  };

  return (
    <Layout title='Payment Method'>
      <CheckoutWizard activeStep={2} />
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component='h1' variant='h1'>
          Payment Method
        </Typography>

        <List>
          <Card style={{ background: '#ffffff', marginBottom: 30 }} raised={true}>
            <ListItem>
              <FormControl component='fieldset'>
                <RadioGroup
                  aria-label='Payment Method'
                  name='paymentMethod'
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    label={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <CreditCardIcon />
                        <Typography
                          style={{ color: '#111111', marginLeft: 10 }}
                          variant='h6'
                        >
                          Cards
                        </Typography>
                        <div style={{ width: '8rem' }} />
                        <Image
                          src={paystack}
                          alt='paystack'
                          width={300}
                          height={80}
                        />
                      </div>
                    }
                    value='Paystack Secure Payment'
                    control={<Radio className={classes.radio} />}
                  />
                  <FormControlLabel
                    label={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <StoreIcon />
                        <Typography
                          style={{ color: '#111111', marginLeft: 10 }}
                          variant='h6'
                        >
                          Pay at Pickup
                        </Typography>
                      </div>
                    }
                    value='Pay at Pickup'
                    control={<Radio className={classes.radio} />}
                  />
                  <FormControlLabel
                    label={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <LocalShippingIcon />
                        <Typography
                          style={{ color: '#111111', marginLeft: 10 }}
                          variant='h6'
                        >
                          Pay on Delivery
                        </Typography>
                      </div>
                    }
                    value='Pay on Delivery'
                    control={<Radio className={classes.radio} />}
                  />
                </RadioGroup>
              </FormControl>
            </ListItem>
          </Card>
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
                Continue
              </Button>
            )}
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              className={classes.buttonBack}
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Payment;
