import { Card, Grid, Link, Typography } from '@material-ui/core';
import React from 'react';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import useStyles from '../utils/styles';
import DoneAllIcon from '@mui/icons-material/DoneAll';

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
          marginTop: '5rem',
        }}
      >
        <Grid item md={4} xs={12}>
          <Card
            style={{
              margin: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 20,
            }}
          >
                      <DoneAllIcon fontSize='large' style={{fontSize: '5rem'}}color='success' />
            <Typography style={{ marginTop: 20 }}>
              Check your registered email address for further instructions on
              how to reset your password.
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
