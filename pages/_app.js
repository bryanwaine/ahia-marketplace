import { SnackbarProvider } from 'notistack';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
//import '@fontsource/poppins';
import { StoreProvider } from '../utils/Store';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Modal } from '@material-ui/core';
import useStyles from '../utils/styles';
import ahia_white_logo from '../public/images/ahia_white_logo.png'
import Image from 'next/image'

function MyApp({ Component, pageProps }) {
  
  const router = useRouter();  
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    const loadingStart = () => {
        setLoading(true);
      }
    const loadingStop = () => {
        setLoading(false);
    }
    
    router.events.on('routeChangeStart', loadingStart);
    router.events.on('routeChangeComplete', loadingStop);
    router.events.on('routeChangeError', loadingStop);

    return () => {
          router.events.off('routeChangeStart', loadingStart);
          router.events.off('routeChangeComplete', loadingStop);
          router.events.off('routeChangeError', loadingStop);
    }
    }, [router]);


  return (
    <>
      {loading ? (
        <Modal open={true}>
          <Box className={classes.loadingModal}>
            <div className={classes.modalLogo}>
              <Image
                src={ahia_white_logo}
                width={500}
                height={450}
                alt='ahia'
              />
            </div>
            <CircularProgress size={60} />
          </Box>
        </Modal>
      ) : null}
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
      >
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </SnackbarProvider>
    </>
  );
}

export default MyApp;
