import { SnackbarProvider } from 'notistack';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
//import '@fontsource/poppins';
import { StoreProvider } from '../utils/Store';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Modal } from '@material-ui/core';
import useStyles from '../utils/styles';

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
    const lodingStart = () => {
        setLoading(true);
      }
    const lodingStop = () => {
        setLoading(false);
    }
    
    router.events.on('routeChangeStart', lodingStart);
    router.events.on('routeChangeComplete', lodingStop);
    router.events.on('routeChangeError', lodingStop);

    return () => {
          router.events.off('routeChangeStart', lodingStart);
          router.events.off('routeChangeComplete', lodingStop);
          router.events.off('routeChangeError', lodingStop);
    }
    }, [router]);


  return (
    <>
      {loading ? (
        <Modal open={open}>
          <Box className={classes.loadingModal}>
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
