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
import NextLink from 'next/link';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useSnackbar } from 'notistack';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    default:
      state;
  }
}

const Users = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;
  const [removeUser, setRemoveUser] = useState('');
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const handleOpen = (user) => {
    setOpenRemoveModal(true), setRemoveUser(user);
  };
  const handleClose = () => setOpenRemoveModal(false);

  const [{ loading, loadingDelete, successDelete, users, error }, dispatch] =
    useReducer(reducer, {
      loading: true,
      loadingDelete: false,
      users: [],
      error: '',
    });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchUsers = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchUsers();
  }, [successDelete, loadingDelete]);

  const removeUserHandler = async (user) => {
    try {
      closeSnackbar();
      handleClose();
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/users/${user._id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar(
        `${user.firstName} ${user.lastName} has been removed from the database`,
        {
          variant: 'warning',
        }
      );
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  return (
    <Layout title='Users' selectedNavPerson>
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
              {removeUser.firstName} {removeUser.lastName}
            </Typography>
          </div>

          <Typography
            variant='h6'
            id='modal-modal-description'
            sx={{ mt: 2 }}
            className={classes.modalText}
          >
            Are you sure you want to remove this user from the database?
          </Typography>
          <div className={classes.modalButtons}>
            <Button variant='text' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color='secondary'
              className={classes.buttonSecondary}
              onClick={() => removeUserHandler(removeUser)}
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
                <ListItem button component='a'>
                  <ListItemText
                    disableTypography={true}
                    primary='Products'
                  ></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href='/admin/users'>
                <ListItem button component='a' selected>
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
                  Users
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
                      ({users.length} {users.length === 0 ? 'users' : users.length > 1 ? 'users' : 'user'})
                    </Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>ID</strong>
                          </TableCell>
                          <TableCell>
                            <strong>FIRST NAME</strong>
                          </TableCell>
                          <TableCell>
                            <strong>LAST NAME</strong>
                          </TableCell>
                          <TableCell>
                            <strong>EMAIL</strong>
                          </TableCell>
                          <TableCell>
                            <strong>PHONE</strong>
                          </TableCell>
                          <TableCell>
                            <strong>ADMIN</strong>
                          </TableCell>
                          <TableCell>
                            <strong>ACTIONS</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>
                              ...{user._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.isAdmin ? `Yes` : `No`}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/users/${user._id}`}
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
                                onClick={() => handleOpen(user)}
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

export default dynamic(() => Promise.resolve(Users), { ssr: false });
