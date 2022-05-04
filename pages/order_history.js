import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import toCurrency from '../utils/toCurrency';
import NextLink from 'next/link';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

const Order_History = () => {
  const classes = useStyles();
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;

  const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  const toUTCString = (date) => {
    let newDate = new Date(date).toUTCString()
      return newDate;
  }

  return (
    <Layout title='Order History' selectedNavPerson>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12} className={classes.gridHide}>
          <Card className={classes.section}>
            <List>
              <NextLink href='/profile'>
                <ListItem button component='a'>
                  <ListItemText
                    disableTypography={true}
                    primary='Profile'
                  ></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href='/order_history'>
                <ListItem button component='a' selected>
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
            <List>
              <ListItem>
                <Typography variant='h1' component='h1'>
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress size={60} />
                ) : error ? (
                  <Typography variant='h6' className={classes.error}>
                    {error}
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>ID</strong>
                          </TableCell>
                          <TableCell>
                            <strong>DATE</strong>
                          </TableCell>
                          <TableCell>
                            <strong>TOTAL</strong>
                          </TableCell>
                          <TableCell>
                            <strong>PAYMENT STATUS</strong>
                          </TableCell>
                          <TableCell>
                            <strong>DELIVERY STATUS</strong>
                          </TableCell>
                          <TableCell>
                            <strong>ACTION</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                {order._id.substring(0, 4)}...
                                {order._id.substring(20, 24)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                {toUTCString(order.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                {' '}
                                ₦{toCurrency(order.totalPrice)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                {' '}
                                {order.isPaid ? (
                                  <span className={classes.greenText}>
                                    {`Paid at ${order.paidAt}`}
                                  </span>
                                ) : (
                                  <span className={classes.redText}>
                                    Not paid
                                  </span>
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                {' '}
                                {order.isDelivered ? (
                                  <span className={classes.greenText}>
                                    {`Delivered at ${order.deliveredAt}`}
                                  </span>
                                ) : (
                                  <span className={classes.redText}>
                                    Not delivered
                                  </span>
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant='contained'>Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Order_History), { ssr: false });
