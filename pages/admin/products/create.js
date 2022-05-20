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

function reducer(state, action) {
  switch (action.type) {
  
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false, successCreate: true };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'UPLOAD_IMAGE_REQUEST':
      return { ...state, loadingUploadImage: true };
    case 'UPLOAD_IMAGE_SUCCESS':
      return { ...state, loadingUploadImage: false, successUpload: true };
    case 'UPLOAD_IMAGE_FAIL':
      return { ...state, loadingUploadImage: false };
    case 'UPLOAD_FEAT_IMAGE_REQUEST':
      return { ...state, loadingUploadFeaturedImage: true };
    case 'UPLOAD_FEAT_IMAGE_SUCCESS':
      return { ...state, loadingUploadFeaturedImage: false, successUpload: true };
    case 'UPLOAD_FEAT_IMAGE_FAIL':
      return { ...state, loadingUploadFeaturedImage: false };
    default:
      state;
  }
}

const ProductCreate = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  const [isFeatured, setIsFeatured] = useState(false);

  const [{ loadingUploadImage, loadingUploadFeaturedImage, loadingCreate }, dispatch] = useReducer(reducer, {
    loadingCreate: false,
  });

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
  }, []);

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      closeSnackbar();
      dispatch({ type: 'UPLOAD_IMAGE_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_IMAGE_SUCCESS' });
      enqueueSnackbar(`Image uploaded successfully!`, {
        variant: 'success',
      });
      setValue('image', data.secure_url);
    } catch (err) {
      closeSnackbar();
      dispatch({ type: 'UPLOAD_IMAGE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  const uploadFeaturedImageHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      closeSnackbar();
      dispatch({ type: 'UPLOAD_FEAT_IMAGE_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_FEAT_IMAGE_SUCCESS' });
      enqueueSnackbar(`Image uploaded successfully!`, {
        variant: 'success',
      });
      setValue('featuredImage', data.secure_url);
    } catch (err) {
      closeSnackbar();
      dispatch({ type: 'UPLOAD_FEAT_IMAGE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const submitHandler = async ({
    name,
    volume,
    servings,
    slug,
    category,
    image,
    featuredImage,
    price,
    vendor,
    countInStock,
    description,
  }) => {
    try {
      closeSnackbar();
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        `/api/admin/products`,
        {
          name,
          volume,
          servings,
          slug,
          category,
          image,
          featuredImage,
          isFeatured,
          price,
          vendor,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      router.push('/admin/products');
      enqueueSnackbar(`Product created successfully!`, {
        variant: 'success',
      });
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title={`Create Product`} selectedNavPerson>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12} className={classes.gridHide}>
          <Card className={classes.section} raised={true}>
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
          <Card className={classes.section} raised={true}>
            <Typography component='h1' variant='h1' style={{ marginLeft: 10 }}>
              Create Product
            </Typography>
            <form
              onSubmit={handleSubmit(submitHandler)}
              className={classes.form}
            >
              <List>
                <ListItem>
                  <Controller
                    name='name'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        id='name'
                        label='Name e.g. Vegetable Soup or Semovita'
                        error={Boolean(errors.name)}
                        helperText={errors.name ? 'Name is required' : null}
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='volume'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        id='volume'
                        label='Volume e.g. 2.5 litres or 1 wrap'
                        error={Boolean(errors.volume)}
                        helperText={errors.volume ? 'Volume is required' : null}
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='servings'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        id='servings'
                        label='Servings e.g. 12'
                        error={Boolean(errors.servings)}
                        helperText={
                          errors.servings ? 'Serving(s) is required' : null
                        }
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='slug'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        id='slug'
                        label='Slug e.g. veg_soup_2.5l or Semo_1wrp'
                        error={Boolean(errors.slug)}
                        helperText={errors.slug ? 'Slug is required' : null}
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='category'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        id='category'
                        label='Category e.g. Soups or Swallow'
                        error={Boolean(errors.category)}
                        helperText={
                          errors.category ? 'Category is required' : null
                        }
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='image'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        disabled
                        id='image'
                        label='Image'
                        error={Boolean(errors.image)}
                        helperText={errors.image ? 'Image is required' : null}
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  {loadingUploadImage ? (
                    <div className={classes.buttonLoading}>
                      <CircularProgress />
                    </div>
                  ) : (
                    <Button variant='contained' component='label'>
                      Upload Image
                      <input type='file' onChange={uploadImageHandler} hidden />
                    </Button>
                  )}
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    label='Featured'
                    control={
                      <Checkbox
                        onClick={(e) => setIsFeatured(e.target.checked)}
                        checked={isFeatured}
                        name='isFeatured'
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='featuredImage'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: false,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        disabled
                        id='featuredImage'
                        label='Featured image'
                        error={Boolean(errors.featuredImage)}
                        helperText={
                          errors.featuredImage
                            ? 'Please upload valid image'
                            : null
                        }
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  {loadingUploadFeaturedImage ? (
                    <div className={classes.buttonLoading}>
                      <CircularProgress />
                    </div>
                  ) : (
                    <Button variant='contained' component='label'>
                      Upload Featured Image
                      <input
                        type='file'
                        onChange={uploadFeaturedImageHandler}
                        hidden
                      />
                    </Button>
                  )}
                </ListItem>
                <ListItem>
                  <Controller
                    name='price'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        id='price'
                        label='Price e.g. 6000'
                        error={Boolean(errors.price)}
                        helperText={errors.name ? 'Price is required' : null}
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='vendor'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        id='vendor'
                        label='Vendor e.g your_brand_name'
                        error={Boolean(errors.vendor)}
                        helperText={errors.vendor ? 'Vendor is required' : null}
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='countInStock'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        id='countInStock'
                        label='Count in stock e.g. 20'
                        error={Boolean(errors.countInStock)}
                        helperText={
                          errors.countInStock
                            ? 'Count in stock is required'
                            : null
                        }
                        {...field}
                      />
                    )}
                  />
                </ListItem>
                <ListItem>
                  <Controller
                    name='description'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        InputProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '0.8rem', fontWeight: 300 },
                        }}
                        variant='outlined'
                        fullWidth
                        multiline
                        id='description'
                        label='Description e.g. your_food_description'
                        error={Boolean(errors.description)}
                        helperText={
                          errors.description ? 'Description is required' : null
                        }
                        {...field}
                      />
                    )}
                  />
                </ListItem>

                <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
                  {loadingCreate ? (
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
                      Create
                    </Button>
                  )}
                </ListItem>
              </List>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(ProductCreate), { ssr: false });
