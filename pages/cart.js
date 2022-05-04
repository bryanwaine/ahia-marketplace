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
  Select,
  MenuItem,
  Card,
  List,
  ListItem,
  CircularProgress,
} from '@material-ui/core';
import React, { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import Image from 'next/image';
import toCurrency from '../utils/toCurrency';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import cart_empty from '../public/images/cart_empty.png';

const CartScreen = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const classes = useStyles();
  const [removeItem, setRemoveItem] = useState('');

  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const handleOpen = (item) => {
    setOpenRemoveModal(true), setRemoveItem(item);
  };
  const handleClose = () => setOpenRemoveModal(false);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const updateCartHandler = async (item, quantity) => {
    closeSnackbar();
    setOpen(true);
    setLoading(true);
    await axios.get(`/api/products/${item._id}`);
    setOpen(false);
    setLoading(false);
    enqueueSnackbar(`Cart has been updated!`, {
      variant: 'success',
    });
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    closeSnackbar();
    handleClose();
    enqueueSnackbar(`${item.name} has been removed from cart!`, {
      variant: 'warning',
    });
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    setLoading(true);
    router.push('/shipping');
  };

  return (
    <Layout title='Shopping Cart' selectedNavCart>
      <Modal
        open={openRemoveModal}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box className={classes.modalBox}>
          <div className={classes.modalHeader}>
            <ErrorOutlineOutlinedIcon
              sx={{
                color: '#ff1111',
                fontSize: '50px !important',
                mr: 2,
              }}
            />
            <Typography
              id='modal-modal-title'
              variant='h2'
              component='h2'
              className={classes.modalText}
            >
              {removeItem.name}
            </Typography>
          </div>

          <Typography
            variant='h6'
            id='modal-modal-description'
            sx={{ mt: 2 }}
            className={classes.modalText}
          >
            Are you sure you want to remove this item from your cart?
          </Typography>
          <div className={classes.modalButtons}>
            <Button variant='text' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color='secondary'
              className={classes.buttonSecondary}
              onClick={() => removeItemHandler(removeItem)}
            >
              Remove
            </Button>
          </div>
        </Box>
      </Modal>
      <div className={classes.spaceBetween}>
        <Typography component='h1' variant='h1'>
          Shopping Cart
        </Typography>
        {loading ? (
          <Modal open={open}>
            <Box className={classes.loadingModal}>
              <CircularProgress size={60} />
            </Box>
          </Modal>
        ) : null}
        <div className={classes.cartSection}>
          <NextLink href='/' passHref>
            <Link>
              {cartItems.length === 0 ? (
                <div></div>
              ) : (
                <Typography variant='h6' className={classes.link}>
                  Continue shopping
                </Typography>
              )}
            </Link>
          </NextLink>
        </div>
      </div>
      {cartItems.length === 0 ? (
        <Grid container>
          <Grid item md={12} xs={12} className={classes.empty_grid} />
          <Grid item md={12} xs={12} className={classes.empty_cart}>
            <Image
              src={cart_empty}
              alt='Your cart is empty'
              width={400}
              height={300}
            />
          </Grid>
          <Grid item md={12} xs={12} className={classes.empty_cart}>
            <NextLink href='/'>
              <Button
                variant='contained'
                color='primary'
                className={classes.buttonPrimary}
              >
                START SHOPPING
              </Button>
            </NextLink>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>IMAGE</TableCell>
                    <TableCell>NAME</TableCell>
                    <TableCell>VOLUME</TableCell>
                    <TableCell align='right'>QUANTITY</TableCell>
                    <TableCell align='right'>PRICE</TableCell>
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <NextLink href={`/products/${item.slug}`} passHref>
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
                        <NextLink href={`/products/${item.slug}`} passHref>
                          <Link>
                            <Typography variant='h6' className={classes.link}>
                              {item.name}
                            </Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>
                        <Typography variant='h6'>
                          {item.volume}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((count) => (
                            <MenuItem key={count + 1} value={count + 1}>
                              <Typography style={{ margin: 0 }} variant='h6'>
                                {count + 1}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='h6'>
                          ₦{toCurrency(item.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='contained'
                          color='secondary'
                          onClick={() => handleOpen(item)}
                        >
                          REMOVE
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant='h2'>
                    <strong>
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                      {''}
                      {cartItems.reduce((a, c) => a + c.quantity, 0) === 1
                        ? 'item'
                        : 'items'}
                      ) :
                    </strong>{' '}
                    ₦
                    {toCurrency(
                      cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
                    )}
                  </Typography>
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
                      onClick={checkoutHandler}
                    >
                      CHECKOUT
                    </Button>
                  )}
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
