import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState, useReducer } from 'react';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../../../utils/Store';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../../../utils/error';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'EDIT_REQUEST':
      return { ...state, loadingEdit: true };
    case 'EDIT_SUCCESS':
      return { ...state, loadingEdit: false, successEdit: true };
    case 'EDIT_FAIL':
      return { ...state, loadingEdit: false };
    default:
      state;
  }
}

const UserEdit = ({ params }) => {
  const userId = params.id;
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  useState(false);

  const [{ loading, loadingEdit, error }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingEdit: false,
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setIsAdmin(data.isAdmin);
          setValue('firstName', data.firstName);
          setValue('lastName', data.lastName);
          dispatch({ type: 'FETCH_SUCCESS' });
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const submitHandler = async ({ firstName, lastName }) => {
    try {
      closeSnackbar();
      dispatch({ type: 'EDIT_REQUEST' });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          firstName,
          lastName,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'EDIT_SUCCESS' });
      enqueueSnackbar(`User updated successfully!`, {
        variant: 'success',
      });
    } catch (err) {
      dispatch({ type: 'EDIT_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title={`Edit User ${userId}`}>
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
            <Typography component='h1' variant='h1' style={{ marginLeft: 10 }}>
              Edit User {userId}
            </Typography>
            <form
              onSubmit={handleSubmit(submitHandler)}
              className={classes.form}
            >
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography className={classes.error}>{error}</Typography>
              ) : (
                <List>
                  <ListItem>
                    <Controller
                      name='firstName'
                      control={control}
                      defaultValue=''
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          InputProps={{
                            style: { fontSize: '0.8rem', fontWeight: 300 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: '0.8rem', fontWeight: 300 },
                          }}
                          variant='standard'
                          fullWidth
                          disabled
                          id='firstName'
                          label='First Name'
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.firstName)}
                          helperText={
                            errors.firstName
                              ? errors.firstName.type === 'minLength'
                                ? 'First Name is not valid'
                                : 'First Name is required'
                              : null
                          }
                          {...field}
                        />
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <Controller
                      name='lastName'
                      control={control}
                      defaultValue=''
                      rules={{
                        required: true,
                        minLength: 2,
                      }}
                      render={({ field }) => (
                        <TextField
                          InputProps={{
                            style: { fontSize: '0.8rem', fontWeight: 300 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: '0.8rem', fontWeight: 300 },
                          }}
                          variant='standard'
                          fullWidth
                          disabled
                          id='lastName'
                          label='Last Name'
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.lastName)}
                          helperText={
                            errors.lastName
                              ? errors.lastName.type === 'minLength'
                                ? 'Last Name is not valid'
                                : 'Last Name is required'
                              : null
                          }
                          {...field}
                        />
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <FormControlLabel
                      label='Admin'
                      control={
                        <Checkbox
                          onClick={(e) => setIsAdmin(e.target.checked)}
                          checked={isAdmin}
                          name='isAdmin'
                        />
                      }
                    />
                  </ListItem>

                  <ListItem
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {loadingEdit ? (
                      <div className={classes.buttonLoading}>
                        <CircularProgress />
                      </div>
                    ) : (
                      <Button
                        fullWidth
                        variant='contained'
                        className={classes.buttonPrimary}
                        color='primary'
                        type='submit'
                      >
                        UPDATE
                      </Button>
                    )}
                  </ListItem>
                </List>
              )}
            </form>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
