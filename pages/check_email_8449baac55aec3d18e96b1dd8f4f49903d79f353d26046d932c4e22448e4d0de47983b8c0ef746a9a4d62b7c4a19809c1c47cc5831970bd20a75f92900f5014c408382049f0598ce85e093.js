import { Card, Grid, Link, Typography } from '@material-ui/core';
import React from 'react';
import NoLayout from '../components/NoLayout';
import NextLink from 'next/link';
import useStyles from '../utils/styles';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Check_email = () => {
  const classes = useStyles();

  return (
    <NoLayout title='Check your email for further Instructions'>
      <div className={classes.form}>
        <Grid
          container
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '5rem',
          }}
        >
          <Grid item md={9} xs={12}>
            <Card
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 20,
                margin: 10,
              }}
              raised={true}
            >
              <DoneAllIcon
                fontSize='large'
                style={{ fontSize: '5rem' }}
                color='success'
              />
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
                Back to Login
              </Typography>
            </Link>
          </NextLink>
        </Grid>
      </div>
    </NoLayout>
  );
};

export default Check_email;
