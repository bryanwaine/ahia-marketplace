import {
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Link,
  Card,
  List,
  ListItem,
  CircularProgress,
  Button,
} from '@material-ui/core';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import Image from 'next/image';
import toCurrency from '../../utils/toCurrency';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';
import { useSnackbar } from 'notistack';
import Script from 'next/script';
import { v4 as uuidv4 } from 'uuid';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVERY_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVERY_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorPay: '',
      };
    default:
      state;
  }
}

const Order = ({ params }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const orderId = params.id;
  const classes = useStyles();
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;
  const [confirmed, setConfirmed] = useState('');
  const [loadingPayNow, setLoadingPayNow] = useState(false);
  const [
    {
      loading,
      loadingPay,
      loadingDeliver,
      order,
      successPay,
      successDeliver,
      error,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    loadingPay: false,
    loadingDeliver: false,
    order: {},
    error: '',
  });

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    isPaid,
    deliveredAt,
    paidAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [order, successPay, successDeliver]);

  //   function makePaymentHandler() {
  //     /*global FlutterwaveCheckout*/
  //     /*eslint no-undef: "error"*/

  //     try {
  //       setLoadingPayNow(true);
  //       FlutterwaveCheckout({
  //         public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
  //         tx_ref: `ahia_${uuidv4()}`,
  //         amount: totalPrice,
  //         currency: 'NGN',
  //         payment_options: '',
  //         // specified redirect URL
  //         // redirect_url: ``,
  //         customer: {
  //           email: userInfo.email,
  //           phone_number: `0${Number(userInfo.phone)}`,
  //           name: `${userInfo.firstName} ${userInfo.lastName}`,
  //         },
  //         callback: async function (response) {
  //           try {
  //             setLoadingPayNow(false);
  //             const verification = await axios.get(
  //               `https://cors-anywhere.herokuapp.com/https://api.flutterwave.com/v3/transactions/${response.transaction_id}/verify`,
  //               {
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                   Authorization: `Bearer ${process.env.NEXT_PUBLIC_FLW_SECRET_KEY}`,
  //                 },
  //               }
  //             );

  //             const verified = verification.data.data;

  //             setConfirmed('pending');

  //             if (
  //               verified.amount === response.amount &&
  //               verified.currency === response.currency &&
  //               verified.status === response.status &&
  //               verified.tx_ref === response.tx_ref
  //             ) {
  //               try {
  //                 dispatch({ type: 'PAY_REQUEST' });
  //                 const { data } = await axios.put(
  //                   `/api/orders/${order._id}/pay`,
  //                   {
  //                     name: verified.customer.name,
  //                     email: verified.customer.email,
  //                     phone: verified.customer.phone_number,
  //                     status: verified.status,
  //                     tx_ref: verified.tx_ref,
  //                   },
  //                   {
  //                     headers: { authorization: `Bearer ${userInfo.token}` },
  //                   }
  //                 );
  //                 setConfirmed('yes');
  //                 dispatch({ type: 'PAY_SUCCESS', payload: data });
  //                 await Router.reload(window.location.pathname);
  //                 enqueueSnackbar(`Your payment was successfull!`, {
  //                   variant: 'success',
  //                 });
  //               } catch (err) {
  //                 dispatch({ type: 'PAY_FAIL', payload: getError(err) });
  //                 enqueueSnackbar(getError(err), {
  //                   variant: 'error',
  //                 });
  //               }
  //             } else
  //               enqueueSnackbar(`Loading payment...`, {
  //                 variant: 'success',
  //               });
  //           } catch (err) {
  //             enqueueSnackbar(getError(err), { variant: 'error' });
  //           }
  //         },
  //         onclose: function () {
  //           // close modal
  //           setLoadingPayNow(false);
  //         },
  //         customizations: {
  //           title: `Order ${orderId}`,
  //           description: `Payment for order ${orderId}`,
  //           logo: 'https://i.postimg.cc/6TBPcPqk/ahia-thumb.png',
  //         },
  //       });
  //     } catch (err) {
  //       setLoadingPayNow(false);
  //       enqueueSnackbar(getError(err), {
  //         variant: 'error',
  //       });
  //     }
  //   }

  function makePaymentHandler() {
    /*global PaystackPop*/
    /*eslint no-undef: "error"*/
    try {
      setLoadingPayNow(true);
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: userInfo.email,
        amount: totalPrice * 100,
        currency: 'NGN',
        metadata: {
          phone_number: `0${Number(userInfo.phone)}`,
          first_name: `${userInfo.firstName}`,
          last_name: `${userInfo.lastName}`,
        },
        ref: `ahia_${uuidv4()}`,
        callback: async function (response) {
          const reference = response.reference;
          const status = response.status;

          try {
            setLoadingPayNow(false);
            const verification = await axios.get(
              `https://api.paystack.co/transaction/verify/${reference}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
                },
              }
            );

            const verified = verification.data.data;
            console.log(verified);

            if (
              verified.reference === reference &&
              verified.status === status
            ) {
              try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await axios.put(
                  `/api/orders/${order._id}/pay`,
                  {
                    name: `${verified.metadata.first_name} ${verified.metadata.last_name}`,
                    email: verified.email,
                    phone: verified.metadata.phone_number,
                    status: verified.status,
                    reference: verified.reference,
                  },
                  {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                  }
                );
                setConfirmed('yes');
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                enqueueSnackbar(`Your payment was successfull!`, {
                  variant: 'success',
                });
              } catch (err) {
                dispatch({ type: 'PAY_FAIL', payload: getError(err) });
                enqueueSnackbar(getError(err), {
                  variant: 'error',
                });
              }
            } else
              enqueueSnackbar(`Loading payment...`, {
                variant: 'success',
              });
          } catch (err) {
            setLoadingPayNow(false);
            enqueueSnackbar(getError(err), { variant: 'error' });
          }
        },
        onClose: function () {
          setLoadingPayNow(false);
          enqueueSnackbar(`Transaction was not completed, window closed.`, {
            variant: 'error',
          });
        },
      });
      handler.openIframe();
    } catch (err) {
      setLoadingPayNow(false);
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  }

  const deliverOrderHandler = async () => {
    try {
      closeSnackbar();
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVERY_SUCCESS', payload: data });
      enqueueSnackbar(`Order delivered successfully!!`, {
        variant: 'success',
      });
    } catch (err) {
      closeSnackbar();
      dispatch({ type: 'DELIVERY_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  const confirmPaymentHandler = async () => {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/pay`,
        {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: `+234${Number(shippingAddress.phone)}`,
          status: `true`,
          reference: `ahia_${uuidv4()}`,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setConfirmed('yes');
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      enqueueSnackbar(`Payment was successfull!`, {
        variant: 'success',
      });
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  return (
    <Layout title={`Order ${orderId}`}>
      <Script src='https://js.paystack.co/v1/inline.js' />
      <Typography component='h1' variant='h1'>
        Order {orderId}
      </Typography>

      {loading ? (
        <div className={classes.buttonLoading}>
          <CircularProgress size={60} />
        </div>
      ) : error ? (
        <Typography variant='h6' className={classes.error}>
          {error}
        </Typography>
      ) : confirmed === 'pending' ? (
        <div className={classes.buttonLoading}>
          <CircularProgress size={60} />
        </div>
      ) : (
        <Grid container spacing={3}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant='h2' component='h2'>
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem
                  style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                  }}
                >
                  <AccountBoxIcon sx={{ marginRight: 1 }} />
                  <Typography variant='h6' style={{ margin: 0 }}>
                    {shippingAddress.fullName}
                  </Typography>{' '}
                </ListItem>
                <ListItem
                  style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                  }}
                >
                  <HomeIcon sx={{ marginRight: 1 }} />
                  <Typography variant='h6' style={{ margin: 0 }}>
                    {shippingAddress.address}, {shippingAddress.city},{' '}
                    {shippingAddress.state}
                  </Typography>
                </ListItem>
                <ListItem
                  style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                  }}
                >
                  <EmailIcon sx={{ marginRight: 1 }} />
                  <Typography variant='h6' style={{ margin: 0 }}>
                    {shippingAddress.email}
                  </Typography>
                </ListItem>
                <ListItem
                  style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                  }}
                >
                  <PhoneIphoneIcon sx={{ marginRight: 1 }} />
                  <Typography variant='h6' style={{ margin: 0 }}>{`+234${Number(
                    shippingAddress.phone
                  )}`}</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant='h6' style={{ margin: 0 }}>
                    {' '}
                    <strong>Status:&nbsp; </strong>{' '}
                    {isDelivered ? (
                      <span className={classes.greenText}>
                        {`Delivered at ${deliveredAt}`}
                      </span>
                    ) : (
                      <span className={classes.redText}>Not delivered</span>
                    )}
                  </Typography>
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant='h2' component='h2'>
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem
                  style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                  }}
                >
                  {paymentMethod === 'Paystack Secure Payment' ? (
                    <CreditCardIcon />
                  ) : paymentMethod === 'Pay at Pickup' ? (
                    <StoreIcon />
                  ) : paymentMethod === 'Pay on Delivery' ? (
                    <LocalShippingIcon />
                  ) : null}
                  <Typography variant='h6' style={{ marginLeft: 10 }}>
                    {paymentMethod}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant='h6' style={{ margin: 0 }}>
                    {' '}
                    <strong>Status:&nbsp; </strong>
                    {isPaid ? (
                      <span className={classes.greenText}>
                        {`Paid at ${paidAt}`}
                      </span>
                    ) : (
                      <span className={classes.redText}>Not paid</span>
                    )}
                  </Typography>
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant='h2' component='h2'>
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>IMAGE</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>VOLUME</TableCell>
                          <TableCell align='right'>QUANTITY</TableCell>
                          <TableCell align='right'>PRICE</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  />
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Typography
                                    variant='h6'
                                    className={classes.link}
                                    style={{ margin: 0 }}
                                  >
                                    <Typography
                                      variant='h6'
                                      style={{ margin: 0 }}
                                    >
                                      {' '}
                                      {item.name}
                                    </Typography>
                                  </Typography>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                {item.volume}
                              </Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                {item.quantity}
                              </Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                ₦{toCurrency(item.price)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant='h2'>Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant='h6' style={{ margin: 0 }}>
                        Items:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant='h6'
                        align='right'
                        style={{ margin: 0 }}
                      >
                        ₦{toCurrency(itemsPrice)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant='h6' style={{ margin: 0 }}>
                        Shipping:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant='h6'
                        align='right'
                        style={{ margin: 0 }}
                      >
                        ₦{toCurrency(shippingPrice)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant='h6' style={{ margin: 0 }}>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant='h6'
                        align='right'
                        style={{ margin: 0 }}
                      >
                        <strong>₦{toCurrency(totalPrice)}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {loadingPay || loadingPayNow ? (
                      <div className={classes.buttonLoading}>
                        <CircularProgress />
                      </div>
                    ) : (
                      <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        className={
                          userInfo.isAdmin ||
                          paymentMethod === 'Pay at Pickup' ||
                          paymentMethod === 'Pay on Delivery'
                            ? classes.noButton
                            : classes.buttonPrimary
                        }
                        onClick={makePaymentHandler}
                      >
                        PAY NOW
                      </Button>
                    )}
                  </ListItem>
                )}
                {userInfo.isAdmin && isPaid && !isDelivered && (
                  <ListItem
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {loadingDeliver ? (
                      <div className={classes.buttonLoading}>
                        <CircularProgress />
                      </div>
                    ) : (
                      <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        className={classes.buttonPrimary}
                        onClick={deliverOrderHandler}
                      >
                        DELIVER ORDER
                      </Button>
                    )}
                  </ListItem>
                )}
                {userInfo.isAdmin && paymentMethod === 'Pay at Pickup' && (
                  <ListItem
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {loadingPay && paymentMethod === 'Pay at Pickup' ? (
                      <div
                        className={
                          loadingPay && paymentMethod !== 'Pay on Delivery'
                            ? classes.noButton
                            : classes.buttonLoading
                        }
                      >
                        <CircularProgress />
                      </div>
                    ) : (
                      <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        className={
                          paymentMethod === 'Pay at Pickup' && isPaid
                            ? classes.noButton
                            : classes.buttonPrimary
                        }
                        onClick={confirmPaymentHandler}
                      >
                        CONFIRM PAYMENT
                      </Button>
                    )}
                  </ListItem>
                )}
                {userInfo.isAdmin && paymentMethod === 'Pay on Delivery' && (
                  <ListItem
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {loadingPay && paymentMethod === 'Pay on Delivery' ? (
                      <div
                        className={
                          loadingPay && paymentMethod !== 'Pay at Pickup'
                            ? classes.noButton
                            : classes.buttonLoading
                        }
                      >
                        <CircularProgress />
                      </div>
                    ) : (
                      <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        className={
                          paymentMethod === 'Pay on Delivery' && isPaid
                            ? classes.noButton
                            : classes.buttonPrimary
                        }
                        onClick={confirmPaymentHandler}
                      >
                        CONFIRM PAYMENT
                      </Button>
                    )}
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
