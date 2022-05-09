import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Layout from '../../../components/Layout';
import TrackingWizard from '../../../components/TrackingWizard';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HouseIcon from '@mui/icons-material/House';
import { Store } from '../../../utils/Store';
import { useRouter } from 'next/router';
import { getError } from '../../../utils/error';
import axios from 'axios';
import dynamic from 'next/dynamic';
import useStyles from '../../../utils/styles';
import { useSnackbar } from 'notistack';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'READY_FOR_DELIVERY_REQUEST':
      return { ...state, loadingReadyForDelivery: true };
    case 'READY_FOR_DELIVERY_SUCCESS':
      return {
        ...state,
        loadingReadyForDelivery: false,
        successReadyForDelivery: true,
      };
    case 'READY_FOR_DELIVERY_FAIL':
      return {
        ...state,
        loadingReadyForDelivery: false,
        errorReadyForDelivery: action.payload,
      };
    case 'READY_FOR_DELIVERY_RESET':
      return {
        ...state,
        loadingReadyForDelivery: false,
        successReadyForDelivery: false,
        errorReadyForDelivery: '',
      };
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
        errorDeliver: '',
      };
    default:
      state;
  }
}

const Tracking = ({ params }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const classes = useStyles();
  const orderId = params.id;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [step, setStep] = useState(0);
  const [
    {
      order,
      loadingReadyForDelivery,
      loadingDeliver,
      successReadyForDelivery,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loadingReadyForDelivery: false,
    loadingDeliver: false,
    order: {},
    errorDeliver: '',
    errorReadyForDelivery: '',
  });

  const { processingAt, readyForDeliveryAt, deliveredAt } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    if (order.isReadyForDelivery) {
      setStep(1);
    }
    if (order.isDelivered) {
      setStep(2);
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
      successReadyForDelivery ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successReadyForDelivery) {
        dispatch({ type: 'READY_FOR_DELIVERY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [order, successReadyForDelivery, successDeliver]);

  const readyForDeliveryHandler = async () => {
    try {
      dispatch({ type: 'READY_FOR_DELIVERY_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/ready_for_delivery`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'READY_FOR_DELIVERY_SUCCESS', payload: data });
      enqueueSnackbar(`Order is ready for delivery`, {
        variant: 'success',
      });
    } catch (err) {
      dispatch({ type: 'READY_FOR_DELIVERY_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

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

  return (
    <Layout title='Track your order'>
      <TrackingWizard activeStep={step ? step : 0} />
      <Grid container style={{ marginTop: `4rem`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid item md={5} xs={12}>
          <Card style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'end' }}>
              {step === 0 ? (
                <OutdoorGrillIcon style={{ fontSize: 100, color: '#ff0000' }} />
              ) : step === 1 ? (
                <LocalShippingIcon
                  style={{ fontSize: 100, color: '#ff0000' }}
                />
              ) : (
                <HouseIcon style={{ fontSize: 100, color: '#ff0000' }} />
              )}

              <Typography variant='h3' style={{ margin: '0 0 15px 10px' }}>
                {step === 0 ? (
                  <strong>Your order is being processed.</strong>
                ) : step === 1 ? (
                  <strong>Your order is ready for delivery.</strong>
                ) : (
                  <strong>Your order has been delivered.</strong>
                )}
              </Typography>
            </div>
            <div
              style={{
                marginLeft: '1rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant='h6'>
                <strong>Status:</strong>&nbsp;
                <span>
                  {step === 0
                    ? `Processing`
                    : step === 1
                    ? `Ready for delivery`
                    : `Delivered`}
                </span>
              </Typography>
              <Typography variant='h6'>
                <strong>Time:</strong>&nbsp;
                <span>
                  {step === 0
                    ? processingAt
                    : step === 1
                    ? readyForDeliveryAt
                    : deliveredAt}
                </span>
              </Typography>
            </div>
          </Card>          
        </Grid>
        <Grid item md={6} xs={12} style={{display: step === 2 && `none`}}>
          <div style={{ margin: '30px 0 30px 0', padding: '0 15px', width: '100%' }}>
            {loadingReadyForDelivery || loadingDeliver ? (
              <div
                style={{ display: 'flex', justifyContent: 'center' }}
                className={classes.buttonLoading}
              >
                <CircularProgress />
              </div>
            ) : (
              <Button
                fullWidth
                variant='contained'
                color='primary'
                className={
                  userInfo.isAdmin ? classes.buttonPrimary : classes.noButton
                }
                onClick={
                  step === 0
                    ? readyForDeliveryHandler
                    : step === 1
                    ? deliverOrderHandler
                    : null
                }
              >
                {step === 0
                  ? `READY FOR DELIVERY`
                  : step === 1
                  ? `DELIVER ORDER`
                  : `DELIVERED`}
              </Button>
            )}
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Tracking), { ssr: false });
