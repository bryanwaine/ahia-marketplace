import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import {
  BarChart,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  YAxis,
} from 'recharts';
// import { Bar } from 'react-chartjs-2';
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
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

const Admin_Dashboard = () => {
  const classes = useStyles();
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;

  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchSummary = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchSummary();
  }, []);

  return (
    <Layout title='Dashboard' selectedNavPerson>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12} className={classes.gridHide}>
          <Card className={classes.section} raised={true}>
            <List>
              <NextLink href='/admin/dashboard'>
                <ListItem button component='a' selected>
                  <ListItemText
                    disableTypography={true}
                    primary='Admin Dashboard'
                  ></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href='/admin/orders'>
                <ListItem button component='a'>
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
          <Card className={classes.section} raised={true}>
            <List>
              <ListItem>
                {loading ? (
                  <div className={classes.buttonLoading}>
                    <CircularProgress size={60} />
                  </div>
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3} xs={12}>
                      <Card raised={true}>
                        <CardContent>
                          <Typography style={{ margin: 0 }}>
                            Sales
                          </Typography>
                          <Typography variant='h1' style={{ fontSize: '2rem' }}>
                            ₦{toCurrency(summary.ordersPrice)}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/orders' passHref>
                            <Button size='small' color='primary'>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                View Sales
                              </Typography>
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <Card raised={true}>
                        <CardContent>
                          <Typography style={{ margin: 0 }}>
                            Orders
                          </Typography>
                          <Typography variant='h1' style={{ fontSize: '2rem' }}>
                            {summary.ordersCount}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/orders' passHref>
                            <Button size='small' color='primary'>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                View Orders
                              </Typography>
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <Card raised={true}>
                        <CardContent>
                          <Typography  style={{ margin: 0 }}>
                            Products
                          </Typography>
                          <Typography variant='h1' style={{ fontSize: '2rem' }}>
                            {summary.productsCount}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/products' passHref>
                            <Button size='small' color='primary'>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                View Products
                              </Typography>
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <Card raised={true}>
                        <CardContent>
                          <Typography  style={{ margin: 0 }}>
                            Users
                          </Typography>
                          <Typography variant='h1' style={{ fontSize: '2rem' }}>
                            {summary.usersCount}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/users' passHref>
                            <Button size='small' color='primary'>
                              <Typography variant='h6' style={{ margin: 0 }}>
                                View Users
                              </Typography>
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography variant='h1' component='h1'>
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem className={classes.barFull}>
                <BarChart width={800} height={400} data={summary.salesData}>
                  <CartesianGrid strokeDasharray={'3 3'} />
                  <XAxis dataKey='_id' />
                  <YAxis dataKey='Total Sales' />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='Total Sales' fill='#11ff11' />
                </BarChart>
              </ListItem>
              <ListItem className={classes.barTab}>
                <BarChart width={700} height={500} data={summary.salesData}>
                  <CartesianGrid strokeDasharray={'3 3'} />
                  <XAxis dataKey='_id' />
                  <YAxis dataKey='Total Sales' />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='Total Sales' fill='#11ff11' />
                </BarChart>
              </ListItem>
              <ListItem className={classes.barMobile}>
                <BarChart width={300} height={200} data={summary.salesData}>
                  <CartesianGrid strokeDasharray={'3 3'} />
                  <XAxis dataKey='_id' />
                  <YAxis dataKey='Total Sales' />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='Total Sales' fill='#11ff11' />
                </BarChart>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Admin_Dashboard), { ssr: false });
