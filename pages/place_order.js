import {
  Button,
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
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import NextLink from 'next/link';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import Image from 'next/image';
import toCurrency from '../utils/toCurrency';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import Cookies from 'js-cookie';

const Place_Order = () => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [loading, setLoading] = useState(false);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  const round2Decimals = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2Decimals(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const shippingPrice = itemsPrice > 10000 ? 500 : 1000;
  const totalPrice = round2Decimals(itemsPrice + shippingPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);

  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'CART_CLEAR' });
      router.push(`/order/${data._id}`);
      Cookies.remove('cartItems');
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title='Place Order'>
      <CheckoutWizard activeStep={3} />
      <Typography component='h1' variant='h1'>
        Place Order
      </Typography>

      <Grid container spacing={3}>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant='h2' component='h2'>
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {' '}
                <Typography variant='h6' style={{ margin: 0 }}>
                  {shippingAddress.fullName}
                </Typography>{' '}
              </ListItem>
              <ListItem>
                <Typography variant='h6' style={{ margin: 0 }}>
                  {shippingAddress.address}, {shippingAddress.city},{' '}
                  {shippingAddress.state}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='h6' style={{ margin: 0 }}>
                  {shippingAddress.email}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='h6' style={{ margin: 0 }}>{`+234${Number(
                  shippingAddress.phone
                )}`}</Typography>
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
              <ListItem>
                <Typography variant='h6' style={{ margin: 0 }}>
                  {paymentMethod}
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
                      {cartItems.map((item) => (
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
                                >
                                  <Typography variant='h6'>
                                    {' '}
                                    {item.name}
                                  </Typography>
                                </Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <Typography variant='h6'>{item.volume}</Typography>
                          </TableCell>
                          <TableCell align='right'>
                            <Typography variant='h6'>
                              {item.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align='right'>
                            <Typography variant='h6'>
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
                    {loading ? (
                      <Typography
                        variant='h6'
                        align='right'
                        style={{ margin: 0 }}
                      >
                        {''}
                      </Typography>
                    ) : (
                      <Typography
                        variant='h6'
                        align='right'
                        style={{ margin: 0 }}
                      >
                        ₦{toCurrency(itemsPrice)}
                      </Typography>
                    )}
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
                    {loading ? (
                      <Typography
                        variant='h6'
                        align='right'
                        style={{ margin: 0 }}
                      >
                        {''}
                      </Typography>
                    ) : (
                      <Typography
                        variant='h6'
                        align='right'
                        style={{ margin: 0 }}
                      >
                        ₦{toCurrency(shippingPrice)}
                      </Typography>
                    )}
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
                    {loading ? (
                      <Typography
                        variant='h6'
                        align='right'
                        style={{ margin: 0 }}
                      >
                        {''}
                      </Typography>
                    ) : (
                      <Typography
                        variant='h6'
                        align='right'
                        style={{ margin: 0 }}
                      >
                        <strong>₦{toCurrency(totalPrice)}</strong>
                      </Typography>
                    )}
                  </Grid>
                </Grid>
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
                    color='primary'
                    className={classes.buttonPrimary}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Place_Order), { ssr: false });
