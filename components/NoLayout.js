import React, { useContext } from 'react';
import Head from 'next/head';
import {
  Container,
  CssBaseline,
  Divider,
  Link,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import ahia_black_logo from '../public/images/ahia_black_logo.png';
import ahia_white_logo from '../public/images/ahia_white_logo.png';
import Image from 'next/image';

export default function NoLayout({ description, title, children }) {
  const { state } = useContext(Store);
  const { darkMode } = state;
  const classes = useStyles();
  const date = new Date().getFullYear();

  let theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 500,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 300,
        margin: '1rem 0',
      },
      h3: {
        fontSize: '1.2rem',
        fontWeight: 300,
        margin: '1rem 0',
      },
      h4: {
        fontSize: '1rem',
        fontWeight: 300,
        margin: '1rem 0',
      },
      h6: {
        fontSize: '0.8rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      p: {
        fontSize: '1rem',
        fontWeight: 300,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#ff0000',
      },
      secondary: {
        main: '#01464a',
      },
      tertiary: {
        main: '#111111',
      },
    },
  });
  theme = responsiveFontSizes(theme);

  return (
    <div>
      <Head>
        <title>{title ? `${title} - ahịa` : `ahịa`}</title>
        <link rel='icon' href='/ahia.svg' />
        {description && <meta name='description' content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.ahiaNoLayout}>
          <div className={classes.ahia}>
            <NextLink href='/' passHref>
              <Image
                src={
                  theme.palette.type === 'light'
                    ? ahia_black_logo
                    : ahia_white_logo
                }
                alt='ahia-marketplace'
                width={80}
                height={60}
              />
            </NextLink>
          </div>
        </div>
        <Container className={classes.main}>{children}</Container>
        <div
          style={{
            textAlign: 'center',
            '& a': {
              color: '#aaaaaa',
            },
            margin: '30px 0 -100px',
          }}
        >
          <Divider variant='middle' />
          <footer>
            <Typography
              variant='h6'
              style={{ fontSize: '0.7rem', marginBottom: 5 }}
            >
              © {date}. Ahịa marketplace. <br /> All rights reserved.
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '0 20px 10px 20px',
              }}
            >
              <NextLink href={`/privacy_policy.html`} passHref>
                <Link>
                  <Typography
                    variant='h6'
                    className={classes.centeredLink}
                    style={{ fontSize: '0.7rem', margin: 0 }}
                  >
                    Privacy Policy
                  </Typography>
                </Link>
              </NextLink>
              <NextLink href={`/terms_and_conditions.html`} passHref>
                <Link>
                  <Typography
                    variant='h6'
                    className={classes.centeredLink}
                    style={{ fontSize: '0.7rem', margin: 0 }}
                  >
                    Terms and Conditions
                  </Typography>
                </Link>
              </NextLink>
              <NextLink href={`/privacy_policy`} passHref>
                <Link>
                  <Typography
                    variant='h6'
                    className={classes.centeredLink}
                    style={{ fontSize: '0.7rem', margin: 0 }}
                  >
                    About Us
                  </Typography>
                </Link>
              </NextLink>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    </div>
  );
}
