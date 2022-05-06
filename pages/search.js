import {
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  MenuItem,
  Modal,
  Select,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import db from '../utils/db';
import { useRouter } from 'next/router';
import Product from '../models/Product';
import ProductItem from '../components/ProductItem';
import axios from 'axios';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import toCurrency from '../utils/toCurrency';
import ahia_white_logo from '../public/images/ahia_white_logo.png';
import Image from 'next/image';
import { Rating } from '@mui/material';

const PAGE_SIZE = 9;

const prices = [
  {
    name: `₦1 to  ₦${toCurrency(1000)}`,
    value: `1-1000`,
  },
  {
    name: `₦${toCurrency(1001)} to  ₦${toCurrency(5000)}`,
    value: `1001-5000`,
  },
  {
    name: `₦${toCurrency(5001)} to  ₦${toCurrency(10000)}`,
    value: `5001-10000`,
  },
  {
    name: `₦${toCurrency(10001)} to ₦${toCurrency(15000)}`,
    value: `10001-15000`,
  },
  {
    name: ` ₦${toCurrency(15001)} to   ₦${toCurrency(20000)}`,
    value: `15001-20000`,
  },
];

const ratings = [1, 2, 3, 4, 5];

const Search = (props) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const [quantityArray, setVolumeArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    cart: { cartItems },
  } = state;
  const router = useRouter();
  const {
    query = 'all',
    category = 'all',
    vendor = 'all',
    price = 'all',
    rating = 'all',
    //sort = 'all',
  } = router.query;
  const { products, countProducts, categories, vendors } = props;

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

  const filterSearch = ({
    page,
    category,
    vendor,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.search = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (vendor) query.vendor = vendor;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (e) => {
    setLoading(true);
    filterSearch({ category: e.target.value });
  };
  // const pageHandler = (e) => {
  //  setLoading(true);
  //   filterSearch({ page: e.target.value });
  // };
  const storeHandler = (e) => {
    setLoading(true);
    filterSearch({ store: e.target.value });
  };
  // const sortHandler = (e) => {
  //  setLoading(true);
  //   filterSearch({ sort: e.target.value });
  // };
  const priceHandler = (e) => {
    setLoading(true);
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    setLoading(true);
    filterSearch({ rating: e.target.value });
  };

  return (
    <Layout title='Search'>
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
      <Grid container spacing={1} style={{ marginTop: '1rem' }}>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography variant='h3' style={{ fontWeight: 500 }}>
                Filter
              </Typography>
            </ListItem>
            <ListItem>
              <Box style={{ width: '100%' }}>
                <Typography variant='h6' style={{ margin: 0 }}>
                  Category
                </Typography>
                <Select fullWidth value={category} onChange={categoryHandler}>
                  <MenuItem value='all'>
                    <Typography variant='h6' style={{ margin: 0 }}>
                      All
                    </Typography>
                  </MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        <Typography variant='h6' style={{ margin: 0 }}>
                          {category}
                        </Typography>
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box style={{ width: '100%' }}>
                <Typography variant='h6' style={{ margin: 0 }}>
                  Vendor
                </Typography>
                <Select fullWidth value={vendor} onChange={storeHandler}>
                  <MenuItem value='all'>
                    <Typography variant='h6' style={{ margin: 0 }}>
                      All
                    </Typography>
                  </MenuItem>
                  {vendors &&
                    vendors.map((vendor) => (
                      <MenuItem key={vendor} value={vendor}>
                        <Typography variant='h6' style={{ margin: 0 }}>
                          {vendor}
                        </Typography>
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box style={{ width: '100%' }}>
                <Typography variant='h6' style={{ margin: 0 }}>
                  Price
                </Typography>
                <Select fullWidth value={price} onChange={priceHandler}>
                  <MenuItem value='all'>
                    <Typography variant='h6' style={{ margin: 0 }}>
                      All
                    </Typography>
                  </MenuItem>
                  {prices &&
                    prices.map((price) => (
                      <MenuItem
                        key={price}
                        value={price.value}
                        variant='h6'
                        style={{ margin: 0 }}
                      >
                        <Typography variant='h6' style={{ margin: 0 }}>
                          {price.name}
                        </Typography>
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box style={{ width: '100%' }}>
                <Typography variant='h6' style={{ margin: 0 }}>
                  Rating
                </Typography>
                <Select fullWidth value={rating} onChange={ratingHandler}>
                  <MenuItem value='all'>
                    <Typography variant='h6' style={{ margin: 0 }}>
                      All
                    </Typography>
                  </MenuItem>
                  {ratings &&
                    ratings.map((rating) => (
                      <MenuItem
                        display='flex'
                        alignItems='center'
                        key={rating}
                        value={rating}
                      >
                        <Rating value={rating} readOnly size='small' />
                        <Typography
                          component='span'
                          variant='h6'
                          style={{ margin: 0 }}
                        >
                          {rating < 5 ? <span>&nbsp; & above</span> : ''}
                        </Typography>
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={9} xs={12}>
          <Grid
            container
            justifyContent='space-between'
            alignItems='center'
            style={{ marginBottom: 15 }}
          >
            <Grid item>
              <strong>
                {products.length === 0 ? 'No' : countProducts}{' '}
                {products.length === 1 ? 'result' : 'results'} found
                {query !== 'all' && query !== '' && ` :: ${query}`}
                {category !== 'all' && ` :: ${category}`}
                {vendor !== 'all' && ` :: ${vendor}`}
                {price !== 'all' && ` :: Price (${price})`}
                {rating !== 'all' &&
                  ` :: Rating (${rating} ${rating < 2 ? `star` : `stars`} ${
                    rating < 5 ? ` & above` : ''
                  })`}
                {(query !== 'all' && query !== '') ||
                category !== 'all' ||
                vendor !== 'all' ||
                rating !== 'all' ||
                price !== 'all' ? (
                  <Button onClick={() => router.push('/search')}>
                    <Typography
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        color: '#ff0000',
                      }}
                    >
                      clear search
                    </Typography>
                  </Button>
                ) : null}
              </strong>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {productArray.map((product) => (
              <Grid item md={4} xs={6} key={product._id}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                  incrementCounter={incrementCounter}
                  decrementCounter={decrementCounter}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <div style={{ height: '2rem' }} />
    </Layout>
  );
};

export default Search;

export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const store = query.store || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const storeFilter = store && store !== 'all' ? { store } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct('category');
  const vendors = await Product.find().distinct('vendor');
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...storeFilter,
      ...ratingFilter,
    },
    '-reviews'
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...storeFilter,
    ...ratingFilter,
  });
  await db.disconnect();

  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      vendors,
    },
  };
}
