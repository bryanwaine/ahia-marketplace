import {
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import useStyles from '../utils/styles';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { getError } from '../utils/error';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ProductItem from '../components/ProductItem';

export default function Home(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { products } = props;
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const [quantityArray, setVolumeArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    cart: { cartItems },
  } = state;

  useEffect(() => {
    try {
      const quantityArr = products.map((product) => {
        const index = cartItems.findIndex((item) => {
          return item._id === product._id;
        });
        const quantity =
          cartItems[index] && cartItems[index].quantity
            ? cartItems[index].quantity
            : 0;
        return [quantity];
      });

      setVolumeArray(quantityArr);
    } catch (err) {
      closeSnackbar();
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
      return;
    }
  }, [products, cartItems, enqueueSnackbar, closeSnackbar]);

  const addToCartHandler = async (product) => {
    closeSnackbar();
    setOpen(true);
    setLoading(true);
    const { data } = await axios.get(`/api/products/${product._id}`);
    const existingItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

    if (data.countInStock < quantity) {
      closeSnackbar();
      setOpen(false);
      setLoading(false);
      enqueueSnackbar('Maximum order quantity exceeded!', {
        variant: 'error',
      });
      return;
    } else {
      closeSnackbar();
      setOpen(false);
      setLoading(false);
      enqueueSnackbar(`${product.name} has been added to cart!`, {
        variant: 'success',
      });
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  const incrementCounter = async (product) => {
    closeSnackbar();
    setOpen(true);
    setLoading(true);
    const { data } = await axios.get(`/api/products/${product._id}`);
    const existingItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

    if (data.countInStock < quantity) {
      closeSnackbar();
      setOpen(false);
      setLoading(false);
      enqueueSnackbar('Maximum order quantity exceeded!', {
        variant: 'error',
      });
      return;
    } else {
      closeSnackbar();
      setOpen(false);
      setLoading(false);
      enqueueSnackbar(`Cart has been updated!`, {
        variant: 'success',
      });
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  let decrementCounter = async (product) => {
    closeSnackbar();
    setOpen(true);
    setLoading(true);
    await axios.get(`/api/products/${product._id}`);
    const existingItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existingItem ? existingItem.quantity - 1 : 0;

    if (quantity === 0) {
      closeSnackbar();
      setOpen(false);
      setLoading(false);
      enqueueSnackbar(`${product.name} has been removed cart!`, {
        variant: 'warning',
      });
      dispatch({ type: 'CART_REMOVE_ITEM', payload: product });
      return;
    } else {
      closeSnackbar();
      setOpen(false);
      setLoading(false);
      enqueueSnackbar(`Cart has been updated!`, {
        variant: 'warning',
      });
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  let productArray = quantityArray.map((item, i) =>
    Object.assign({}, item, products[i])
  );

  return (
    <Layout title='Home' selectedNavHome>
      <div>
        <Typography component='h1' variant='h1'>
          Products
        </Typography>
        {loading ? (
          <Modal open={open} style={{ outline: 'none !important' }}>
            <Box className={classes.loadingModal}>
              <CircularProgress size={60} />
            </Box>
          </Modal>
        ) : null}
        <Grid container spacing={2}>
          {productArray.map((product) => (
            <Grid item md={3} xs={6} key={product._id}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
                incrementCounter={incrementCounter}
                decrementCounter={decrementCounter}
              />
            </Grid>
          ))}
        </Grid>
        <div style={{ height: '2rem' }} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}, '-reviews').lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
