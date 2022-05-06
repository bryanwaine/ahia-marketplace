import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
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
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import toCurrency from '../../utils/toCurrency';
import NextLink from 'next/link';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useSnackbar } from 'notistack';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, sucessDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    default:
      state;
  }
}

const Products = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;
  const [removeProduct, setRemoveProduct] = useState('');
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const handleOpen = (product) => {
    setOpenRemoveModal(true), setRemoveProduct(product);
  };
  const handleClose = () => setOpenRemoveModal(false);

  const [{ loading, loadingDelete, sucessDelete, products, error }, dispatch] =
    useReducer(reducer, {
      loading: true,
      loadingDelete: false,
      products: [],
      error: '',
    });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchSummary = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchSummary();
  }, [sucessDelete, loadingDelete]);

  const removeProductHandler = async (product) => {
    try {
      closeSnackbar();
      handleClose();
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${product._id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar(`${product.name} has been removed from the database`, {
        variant: 'warning',
      });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  return (
    <Layout title='Products' selectedNavPerson>
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
              {removeProduct.name}
            </Typography>
          </div>

          <Typography
            variant='h6'
            id='modal-modal-description'
            sx={{ mt: 2 }}
            className={classes.modalText}
          >
            Are you sure you want to remove this item from the database?
          </Typography>
          <div className={classes.modalButtons}>
            <Button variant='text' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color='secondary'
              className={classes.buttonSecondary}
              onClick={() => removeProductHandler(removeProduct)}
            >
              Remove
            </Button>
          </div>
        </Box>
      </Modal>
      {loadingDelete ? (
        <Modal open={open}>
          <Box className={classes.loadingModal}>
            <CircularProgress size={60} />
          </Box>
        </Modal>
      ) : null}
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
                <ListItem button component='a'>
                  <ListItemText
                    disableTypography={true}
                    primary='Orders'
                  ></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href='/admin/products'>
                <ListItem button component='a' selected>
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
              <ListItem
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography variant='h1' component='h1'>
                  Products
                </Typography>
                <NextLink href='/admin/products/create' passHref>
                  <Button
                    variant='contained'
                    className={classes.buttonPrimary}
                    color='primary'
                    type='submit'
                  >
                    CREATE
                  </Button>
                </NextLink>
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
                      ({products.length} {products.length > 1 ? 'products' : 'product'})
                    </Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>ID</strong>
                          </TableCell>
                          <TableCell>
                            <strong>NAME</strong>
                          </TableCell>
                          <TableCell>
                            <strong>VOLUME</strong>
                          </TableCell>
                          <TableCell>
                            <strong>SERVINGS</strong>
                          </TableCell>
                          <TableCell>
                            <strong>PRICE</strong>
                          </TableCell>
                          <TableCell>
                            <strong>CATEGORY</strong>
                          </TableCell>
                          <TableCell>
                            <strong>COUNT</strong>
                          </TableCell>
                          <TableCell>
                            <strong>RATING</strong>
                          </TableCell>
                          <TableCell>
                            <strong>ACTIONS</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              ...{product._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.volume}</TableCell>
                            <TableCell>{product.servings}</TableCell>
                            <TableCell>₦{toCurrency(product.price)}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/products/${product._id}`}
                                passHref
                              >
                                <Button
                                  size='small'
                                  variant='contained'
                                  style={{ margin: '5px 0' }}
                                >
                                  EDIT
                                </Button>
                              </NextLink>
                              &nbsp;&nbsp;
                              <Button
                                size='small'
                                variant='contained'
                                style={{ margin: '5px 0' }}
                                onClick={() => handleOpen(product)}
                              >
                                REMOVE
                              </Button>
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

export default dynamic(() => Promise.resolve(Products), { ssr: false });
