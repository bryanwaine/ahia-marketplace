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
          <Card style={{ background: '#ffffff', marginBottom: 30 }}>
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
                        }}
                      >
                        <Typography style={{ color: '#111111' }} variant='h6'>
                          Cards
                        </Typography>
                        <div style={{ width: '8rem' }} />
                        <Image
                          src={paystack}
                          alt='paystack'
                          width={300}
                          height={50}
                        />
                      </div>
                    }
                    value='Paystack Secure Payment'
                    control={<Radio className={classes.radio} />}
                  />
                  <FormControlLabel
                    label={
                      <Typography style={{ color: '#111111' }} variant='h6'>
                        Pay at Pickup
                      </Typography>
                    }
                    value='Pay on Delivery'
                    control={<Radio className={classes.radio} />}
                  />
                  <FormControlLabel
                    label={
                      <Typography style={{ color: '#111111' }} variant='h6'>
                        Pay on Delivery
                      </Typography>
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
