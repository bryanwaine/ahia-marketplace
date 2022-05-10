import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import { Rating } from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import toCurrency from '../utils/toCurrency';
import useStyles from '../utils/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

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

const ProductItem = ({
  product,
  addToCartHandler,
  incrementCounter,
  decrementCounter,
}) => {
  const classes = useStyles();
  return (
    <Card>
      <NextLink href={`/products/${product.slug}`} passHref>
        <CardActionArea>
          <CardMedia
            component='img'
            image={product.image}
            title={product.name}
          ></CardMedia>
          <CardContent style={{ marginBottom: -40, marginTop: -20 }}>
            <Grid container spacing={0}>
              <Grid item md={12} xs={12} style={{ marginBottom: -15 }}>
                <Typography
                  style={{
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    height: '1.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: 0,
                  }}
                  variant='h6'
                >
                  <strong>{product.name}</strong>
                </Typography>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  marginBottom: -30,
                }}
              >
                <TakeoutDiningIcon fontSize='small' sx={{ mr: 1 }} />
                <Typography variant='h6'>{product.volume}</Typography>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  marginBottom: -10,
                }}
              >
                <RestaurantMenuIcon fontSize='small' sx={{ mr: 1 }} />
                <Typography variant='h6'>
                  {product.servings}{' '}
                  {product.servings > 1 ? `servings` : `serving`}
                </Typography>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                style={{
                  marginBottom: -10,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Rating
                  style={{ color: '#ff0000' }}
                  value={product.rating}
                  readOnly
                  size='small'
                />
                <Typography
                  variant='h6'
                  style={{ color: '#ff0000', margin: 0 }}
                >
                  ({product.numReviews})
                </Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <div style={{ height: '1rem' }} />
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <Typography
              variant='h6'
              style={{ paddingLeft: 10, marginBottom: -10 }}
            >
              ₦{toCurrency(product.price)}
            </Typography>
          </Grid>
          {product[0] === 0 ? (
            <Grid
              item
              md={9}
              xs={12}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 15,
              }}
            >
              <Button
                size='small'
                color='primary'
                variant='contained'
                fullWidth
                className={classes.link}
                disabled={product.countInStock <= 0 ? true : false}
                onClick={() => addToCartHandler(product)}
              >
                <Typography
                  style={{ margin: 5, color: '#ffffff' }}
                  variant='h6'
                >
                  {product.countInStock <= 0 ? `OUT OF STOCK` : `ADD TO CART`}
                </Typography>
              </Button>
            </Grid>
          ) : (
            <Grid
              item
              md={9}
              xs={12}
              className={classes.counterBtn}
              style={{ marginTop: 21, marginBottom: -2.5 }}
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
      </CardActions>
    </Card>
  );
};

export default ProductItem;
