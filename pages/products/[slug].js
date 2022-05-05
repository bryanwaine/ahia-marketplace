import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import NextLink from 'next/link';
import Router from 'next/router';
import useStyles from '../../utils/styles';
import Image from 'next/image';
import toCurrency from '../../utils/toCurrency';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getError } from '../../utils/error';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ahia_white_logo from '../../public/images/ahia_white_logo.png';

function ButtonDecrement({ onClickFunc }) {
  const classes = useStyles();
  return (
    <div
      color='primary'
      variant='contained'
      onClick={onClickFunc}
      className={classes.btnDecrement}
    >
      <RemoveIcon />
    </div>
  );
}

function Display(props) {
  const classes = useStyles();
  return (
    <div className={classes.display}>
      <Typography>{props.message}</Typography>
    </div>
  );
}

function ButtonIncrement({ product, onClickFunc }) {
  const classes = useStyles();
  return (
    <div
      color='primary'
      variant='contained'
      className={classes.btnIncrement}
      onClick={onClickFunc}
      disabled={product.countInStock > 0 ? false : true}
    >
      <AddIcon />
    </div>
  );
}

export default function ProductScreen(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);

  const [quantityArray, setVolumeArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const { product } = props;
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  useEffect(() => {
    Router.isReady ? setLoading(true) : setLoading(false);
    fetchReviews();
    try {
      const quantityArr = [product].map((product) => {
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
  }, [product, cartItems, enqueueSnackbar, closeSnackbar]);

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
      enqueueSnackbar(`${product.name} has been removed from cart!`, {
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

  let cartArray = quantityArray.map((item, i) =>
    Object.assign({}, item, [product][i])
  );

  const classes = useStyles();
  if (!product) {
    return <div>Product not found</div>;
  }

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    closeSnackbar();
    setLoadingReview(true);
    setComment('');
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      setLoadingReview(false);
      await Router.reload(window.location.pathname);
      enqueueSnackbar(`Review submitted successfully!!`, {
        variant: 'success',
      });
    } catch (err) {
      closeSnackbar();
      setLoadingReview(false);
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.slugSection}>
        <NextLink href='/' passHref>
          <Link>
            <Typography variant='h6' className={classes.link}>
              Back to products
            </Typography>
          </Link>
        </NextLink>
        {loading ? (
          <Modal open={open}>
            <Box className={classes.loadingModal}>
              <div className={classes.modalLogo}>
                <Image
                  src={ahia_white_logo}
                  width={500}
                  height={450}
                  alt='ahia'
                />
              </div>
              <CircularProgress size={60} />
            </Box>
          </Modal>
        ) : null}
      </div>
      {cartArray.map((product) => (
        <Grid key={product.id} container spacing={1}>
          <Grid item md={5} xs={12}>
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              layout='responsive'
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <List>
              <ListItem>
                <Typography component='h1' variant='h1'>
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='h6' style={{ margin: 0 }}>
                  <strong>CATEGORY:</strong> {product.category}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='h6' style={{ margin: 0 }}>
                  <strong>VENDOR: </strong>
                  {product.vendor}
                </Typography>
              </ListItem>
              <ListItem>
                <Rating
                  style={{ color: '#ff0000' }}
                  value={product.rating}
                  readOnly
                />
                <Link href='#reviews'>
                  <Typography variant='h6' style={{ margin: 0 }}>
                    ({product.numReviews}{' '}
                    {product.numReviews.length > 1 ? `reviews` : `review`})
                  </Typography>
                </Link>
              </ListItem>
              <ListItem>
                <Typography variant='h6' style={{ margin: 0 }}>
                  <strong>DESCRIPTION:</strong> {product.description}
                </Typography>{' '}
              </ListItem>
              <ListItem>
                <Typography variant='h6' style={{ margin: 0 }}>
                  <strong>VOLUME:</strong> {product.volume}
                </Typography>{' '}
              </ListItem>
              <ListItem>
                <Typography variant='h6' style={{ margin: 0 }}>
                  <strong>NUMBER OF SERVINGS:</strong> {product.servings}
                </Typography>{' '}
              </ListItem>
            </List>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid Item xs={6}>
                      <Typography variant='h6' style={{ margin: 0 }}>
                        <strong>Price:</strong>
                      </Typography>
                    </Grid>
                    <Grid Item xs={6}>
                      <Typography
                        variant='h6'
                        style={{ textAlign: 'right', margin: 0 }}
                      >
                        ₦{toCurrency(product.price)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid Item xs={6}>
                      <Typography variant='h6' style={{ margin: 0 }}>
                        <strong>Status:</strong>
                      </Typography>
                    </Grid>
                    <Grid Item xs={6}>
                      <Typography
                        variant='h6'
                        style={{ textAlign: 'right', margin: 0 }}
                      >
                        {product.countInStock > 0 ? `IN STOCK` : `OUT OF STOCK`}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem style={{ margin: '20px 0' }}>
                  <Grid container spacing={3}>
                    {product[0] === 0 ? (
                      <Grid item md={12} xs={12}>
                        <Button
                          fullWidth
                          size='small'
                          color='primary'
                          variant='contained'
                          className={classes.buttonPrimary}
                          disabled={product.countInStock <= 0 ? true : false}
                          onClick={() => addToCartHandler(product)}
                        >
                          {product.countInStock <= 0
                            ? `OUT OF STOCK`
                            : `ADD TO CART`}
                        </Button>
                      </Grid>
                    ) : (
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.counterBtnSlug}
                      >
                        <div className={classes.btnDiv}>
                          <ButtonDecrement
                            product={product}
                            onClickFunc={() => decrementCounter(product)}
                          />
                          <Display message={product[0]} />
                          <ButtonIncrement
                            product={product}
                            onClickFunc={() => incrementCounter(product)}
                          />
                        </div>
                      </Grid>
                    )}
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      ))}
      <List>
        <ListItem>
          <Typography variant='h3' name='reviews' id='reviews'>
            Customer Reviews
          </Typography>
        </ListItem>
        <ListItem
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          }}
        >
          {reviews.length === 0 ? (
            <Card style={{ width: '100%', maxWidth: 500, padding: 10 }}>
              {' '}
              No reviews yet.
            </Card>
          ) : (
            reviews.map((review) => (
              <Grid
                container
                spacing={1}
                key={review._id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 15,
                }}
              >
                <Card style={{ width: '100%', maxWidth: 500, padding: 10 }}>
                  <Grid item className={classes.reviewItem}>
                    <Typography variant='h6'>
                      <strong>{review.name}</strong>
                    </Typography>
                  </Grid>
                  <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='h6' style={{ marginRight: 15 }}>
                      {review.createdAt.substring(0, 10)}
                    </Typography>
                    <Rating
                      style={{ color: '#ff0000' }}
                      value={review.rating}
                      readOnly
                    />
                  </Grid>
                  <Grid item md={5} xs={12}>
                    <Typography variant='h6'>{review.comment}</Typography>
                  </Grid>
                  <Grid item md={5} xs={12}></Grid>
                </Card>
              </Grid>
            ))
          )}
        </ListItem>
        <ListItem>
          {userInfo ? (
            <form onSubmit={submitHandler} className={classes.reviewForm}>
              <List>
                <ListItem>
                  <Typography variant='h3'>Leave your review</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    InputProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '0.8rem', fontWeight: 300 },
                    }}
                    multiline
                    variant='outlined'
                    fullWidth
                    name='review'
                    label='Enter comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Rating
                    style={{ color: '#ff0000' }}
                    name='simple-controlled'
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </ListItem>
                <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
                  {loadingReview ? (
                    <div className={classes.buttonLoading}>
                      <CircularProgress />
                    </div>
                  ) : (
                    <Button
                      variant='contained'
                      color='primary'
                      className={classes.buttonPrimary}
                      fullWidth
                      type='submit'
                    >
                      Submit
                    </Button>
                  )}
                </ListItem>
              </List>
            </form>
          ) : (
            <Typography variant='h3'>
              Please{' '}
              <Link href={`/login?redirect=/products/${product.slug}`}>
                login
              </Link>{' '}
              to write a review.
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, '-reviews').lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
