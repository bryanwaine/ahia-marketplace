import { Card, Grid, Link, Typography } from '@material-ui/core';
import React from 'react';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import useStyles from '../utils/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Check_email = () => {
  const classes = useStyles();
  return (
    <Layout title='Check your email for further Instructions'>
      <Typography component='h1' variant='h1'>
        Reset password
      </Typography>
      <Grid
        container
        style={{
          display: 'flex',
          flexDirection: 'column',
            alignItems: 'center',
          marginTop: '5rem'
        }}
      >
        <Grid item md={4} xs={12}>
          <Card
            style={{
              margin: 10,
              display: 'flex',
              flexDirection: 'column',
                          alignItems: 'center',
              padding: 20
            }}
          >
            <CheckCircleOutlineIcon fontSize='large' color='success' />
            <Typography style={{ marginTop: 20 }}>
              Check your registered email address for
              further instructions on how to reset your password.
            </Typography>
          </Card>
        </Grid>

        <NextLink href={`/login`} passHref>
          <Link>
            <Typography
              variant='h6'
              className={classes.centeredText}
              style={{ color: '#ff0000' }}
            >
              Back to sign in
            </Typography>
          </Link>
        </NextLink>
      </Grid>
    </Layout>
  );
};

export default Check_email;
