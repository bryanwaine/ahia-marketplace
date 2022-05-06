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
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import toCurrency from '../../utils/toCurrency';
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

const Orders = () => {
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
    const fetchSummary = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchSummary();
  }, []);

  const toUTCString = (date) => {
    let newDate = new Date(date).toUTCString();
    return newDate;
  };

  return (
    <Layout title='Order History' selectedNavPerson>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12} className={classes.gridHide}>
          <Card className={classes.section}>
            <List>
              <NextLink href='/admin/dashboard'>
                <ListItem button component='a'>
                  <ListItemText
                    disableTypography={true}
                    primary='Admin Dashboard'
                  ></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href='/admin/orders'>
                <ListItem button component='a' selected>
                  <ListItemText
                    disableTypography={true}
                    primary='Orders'
                  ></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href='/admin/products'>
                <ListItem button component='a'>
                  <ListItemText
                    disableTypography={true}
                    primary='Products'
                  ></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href='/admin/users'>
                <ListItem button component='a'>
                  <ListItemText
                    disableTypography={true}
                    primary='Users'
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
                  Orders
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <div className={classes.buttonLoading}>
                    <CircularProgress size={60} />
                  </div>
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Typography>
                      ({orders.length} {orders.length > 1 ? 'orders' : 'order'})
                    </Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>ID</strong>
                          </TableCell>
                          <TableCell>
                            <strong>USER</strong>
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
                              ...{order._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>
                              {order.user
                                ? order.user.firstName
                                : 'DELETED USER'}
                            </TableCell>
                            <TableCell>
                              {toUTCString(order.createdAt)}
                            </TableCell>
                            <TableCell>
                              ₦{toCurrency(order.totalPrice)}
                            </TableCell>
                            <TableCell>
                              {order.isPaid ? (
                                <span className={classes.greenText}>
                                  {`Paid at ${order.paidAt}`}
                                </span>
                              ) : (
                                <span className={classes.redText}>
                                  Not paid
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered ? (
                                <span className={classes.greenText}>
                                  {`Delivered at ${order.deliveredAt}`}
                                </span>
                              ) : (
                                <span className={classes.redText}>
                                  Not delivered
                                </span>
                              )}
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

export default dynamic(() => Promise.resolve(Orders), { ssr: false });
