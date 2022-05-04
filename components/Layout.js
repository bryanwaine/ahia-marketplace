import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import {
  AppBar,
  Badge,
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Link,
  List,
  ListItem,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@mui/icons-material/Menu';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import NextLink from 'next/link';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { withStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import ahia_black_logo from '../public/images/ahia_black_logo.png';
import ahia_white_logo from '../public/images/ahia_white_logo.png';
import Image from 'next/image';
import axios from 'axios';

const ThemeToggleSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-root': {
    padding: '0px !important',
  },
  '& .MuiSwitch-switchBase': {
    margin: 5,
    padding: 0,
    transform: 'translateX(9.5px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(18px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#333333',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#111111' : '#015c61',
    width: 20,
    height: 20,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 1,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#111111' : '#dddddd',
    border: '0.1px solid #bbbbbb',
    borderRadius: 30,
    marginTop: -9.4,
    height: 25.2,
    width: 40,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function Layout({
  description,
  title,
  children,
  selectedNavHome,
  selectedNavPerson,
  selectedNavCart,
}) {
  const date = new Date().getFullYear();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const [anchorEl, setAnchorEl] = useState(null);
  const [topbarVisible, setTopbarVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [activeCategories, setActiveCategories] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  let theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 300,
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

  const classes = useStyles();
  const darkModeSwitchHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const userDarkMode = !darkMode;
    Cookies.set('darkMode', userDarkMode ? 'ON' : 'OFF');
  };

  const topbarOpenHandler = () => {
    setTopbarVisible(true);
    setActiveSearch(true);
  };
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
    setActiveCategories(true);
  };
  const rightSidebarOpenHandler = () => {
    setRightSidebarVisible(true);
  };
  const topbarCloseHandler = () => {
    setTopbarVisible(false);
    setActiveSearch(false);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
    setActiveCategories(false);
  };
  const rightSidebarCloseHandler = () => {
    setRightSidebarVisible(false);
  };

  const userMenuClickHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const userMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  const userLogoutHandler = () => {
    setAnchorEl(null);
    closeSnackbar();
    enqueueSnackbar(`Goodbye, ${userInfo.firstName}`, {
      variant: 'success',
    });
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - ahịa` : `ahịa`}</title>
        <link rel='icon' href='/ahia.svg' />
        {description && <meta name='description' content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          position='static'
          className={
            theme.palette.type === 'dark' ? classes.darkNavbar : classes.navbar
          }
        >
          <Toolbar className={classes.toolbar}>
            <Box display='flex' alignItems='center'>
              <IconButton
                edge='start'
                aria-label='open drawer'
                onClick={sidebarOpenHandler}
                className={classes.hideHamburger}
              >
                <MenuIcon
                  style={{
                    color: theme.palette.type === 'dark' && '#ffffff',
                  }}
                />
              </IconButton>
              <div className={classes.ahia}>
                <NextLink href='/' passHref>
                  <Image
                    src={
                      theme.palette.type === 'light'
                        ? ahia_black_logo
                        : ahia_white_logo
                    }
                    alt='ahia-marketplace'
                    width={100}
                    height={60}
                  />
                </NextLink>
              </div>
            </Box>
            <Drawer
              anchor='left'
              open={sidebarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Typography variant='h3'>Shop by category</Typography>
                    <IconButton
                      aria-label='close'
                      onClick={sidebarCloseHandler}
                    >
                      <CancelOutlinedIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                  >
                    <ListItem
                      button
                      component='a'
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText
                        disableTypography={true}
                        primary={
                          <Typography style={{ margin: 0 }} variant='h6'>
                            {category}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </NextLink>
                ))}
              </List>
              <div className={classes.footer}>
                <Divider />
                <footer>
                  <Typography variant='h6'>
                    © {date}. Ahịa marketplace. <br /> All rights reserved.
                  </Typography>
                </footer>
              </div>
            </Drawer>
            <div className={classes.navBarSearchDiv}>
              <div className={classes.navBarSearchFull}>
                <form
                  className={classes.navBarSearchForm}
                  onSubmit={submitHandler}
                >
                  <InputBase
                    name='query'
                    className={
                      theme.palette.type === 'light'
                        ? classes.navBarSearchInputFull
                        : classes.navBarSearchInputFullDark
                    }
                    placeholder='Search products'
                    onChange={queryChangeHandler}
                  />
                  <IconButton
                    type='submit'
                    className={classes.iconButton}
                    aria-label='search'
                  >
                    <SearchIcon style={{ color: '#666666' }} />
                  </IconButton>
                </form>
              </div>
            </div>
            <div>
              <IconButton
                className={classes.navButtonSearch}
                aria-label='search'
                onClick={topbarOpenHandler}
              >
                <NextLink href='#' passHref>
                  <Link style={{ textDecoration: 'none' }}>
                    <div className={classes.navButtonDiv}>
                      <SearchIcon
                        className={
                          activeSearch
                            ? classes.selectedSearchIcon
                            : theme.palette.type === 'light'
                            ? classes.navButton
                            : classes.navButtonDark
                        }
                      />
                      <Typography
                        variant='h6'
                        component='h6'
                        className={
                          activeSearch
                            ? classes.selectedSearchText
                            : theme.palette.type === 'light'
                            ? classes.typography
                            : classes.typographyDark
                        }
                      >
                        Search
                      </Typography>
                    </div>
                  </Link>
                </NextLink>
              </IconButton>
            </div>
            <Drawer
              anchor='left'
              open={topbarVisible}
              onClose={topbarCloseHandler}
              className={classes.navBarSearchDrawerParent}
            >
              <Box
                className={
                  theme.palette.type === 'light'
                    ? classes.navBarSearchDrawer
                    : classes.navBarSearchDrawerDark
                }
              >
                <IconButton
                  aria-label='close'
                  onClick={topbarCloseHandler}
                  className={classes.backArrowIconButton}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <div className={classes.navBarSearch}>
                  <form
                    className={classes.navBarSearchForm}
                    onSubmit={submitHandler}
                  >
                    <InputBase
                      name='query'
                      autoFocus={true}
                      className={
                        theme.palette.type === 'light'
                          ? classes.navBarSearchInput
                          : classes.navBarSearchInputDark
                      }
                      placeholder=' Search products'
                      onChange={queryChangeHandler}
                    />
                    <IconButton
                      type='submit'
                      className={classes.searchIconButton}
                      aria-label='search'
                    >
                      <SearchIcon style={{ color: '#666666' }} />
                    </IconButton>
                  </form>
                </div>
              </Box>
            </Drawer>
            <div>
              <IconButton
                className={classes.navButtonWrapper}
                aria-label='cart'
              >
                <div className={classes.navButtonDiv}>
                  <NextLink href='/cart' passHref>
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color='secondary'
                        badgeContent={cart.cartItems.length}
                        className={classes.badge}
                      >
                        <ShoppingBasketOutlinedIcon
                          className={
                            selectedNavCart
                              ? classes.selectedCartIcon
                              : theme.palette.type === 'light'
                              ? classes.navButton
                              : classes.navButtonDark
                          }
                        />
                      </Badge>
                    ) : (
                      <ShoppingBasketOutlinedIcon
                        className={
                          selectedNavCart
                            ? classes.selectedCartIcon
                            : theme.palette.type === 'light'
                            ? classes.navButton
                            : classes.navButtonDark
                        }
                      />
                    )}
                  </NextLink>
                  <NextLink href='/cart' passHref>
                    <Typography
                      variant='h6'
                      component='h6'
                      className={
                        selectedNavCart
                          ? classes.selectedHomeText
                          : theme.palette.type === 'light'
                          ? classes.typography
                          : classes.typographyDark
                      }
                    >
                      Cart
                    </Typography>
                  </NextLink>
                </div>
              </IconButton>
            </div>
            {userInfo ? (
              <div className={classes.flexDiv}>
                <IconButton
                  className={classes.navButtonWrapper}
                  aria-controls='customized-menu'
                  aria-haspopup='true'
                  aria-label='profile'
                  variant='text'
                  color='primary'
                  onClick={userMenuClickHandler}
                >
                  <div className={classes.navButtonDiv}>
                    <PersonOutlineOutlinedIcon
                      className={
                        selectedNavPerson
                          ? classes.selectedPersonIcon
                          : theme.palette.type === 'light'
                          ? classes.navButton
                          : classes.navButtonDark
                      }
                    />
                    <Typography
                      variant='h6'
                      component='h6'
                      className={
                        selectedNavPerson
                          ? classes.selectedPersonText
                          : theme.palette.type === 'light'
                          ? classes.typography
                          : classes.typographyDark
                      }
                    >
                      {userInfo.firstName}
                    </Typography>
                  </div>
                </IconButton>
                <StyledMenu
                  id='customized-menu'
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={userMenuCloseHandler}
                >
                  <StyledMenuItem onClick={userMenuCloseHandler}>
                    <ListItemIcon>
                      <AccountCircleOutlinedIcon fontSize='small' />
                    </ListItemIcon>
                    <NextLink href='/profile' passHref>
                      <ListItemText primary='Profile' />
                    </NextLink>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={userMenuCloseHandler}>
                    <ListItemIcon>
                      <HistoryIcon fontSize='medium' />
                    </ListItemIcon>
                    <NextLink
                      href={
                        userInfo.isAdmin ? '/admin/orders' : '/order_history'
                      }
                      passHref
                    >
                      <ListItemText primary='My Orders' />
                    </NextLink>
                  </StyledMenuItem>
                  {userInfo.isAdmin && (
                    <StyledMenuItem onClick={userMenuCloseHandler}>
                      <ListItemIcon>
                        <DashboardOutlinedIcon fontSize='medium' />
                      </ListItemIcon>
                      <NextLink href='/admin/dashboard' passHref>
                        <ListItemText primary='Admin Dashboard' />
                      </NextLink>
                    </StyledMenuItem>
                  )}
                  <StyledMenuItem onClick={userLogoutHandler}>
                    <ListItemIcon>
                      <ExitToAppIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary='Logout' />
                  </StyledMenuItem>
                </StyledMenu>
              </div>
            ) : (
              <div className={classes.flexDiv}>
                <NextLink href='/login' passHref>
                  <Link>
                    <IconButton
                      className={classes.navButtonWrapper}
                      aria-label='sign_in'
                    >
                      <div className={classes.navButtonDiv}>
                        <PersonOutlineOutlinedIcon
                          className={
                            theme.palette.type === 'light'
                              ? classes.navButton
                              : classes.navButtonDark
                          }
                        />
                        <Typography
                          variant='h6'
                          component='h6'
                          className={
                            theme.palette.type === 'light'
                              ? classes.typography
                              : classes.typographyDark
                          }
                        >
                          Sign In
                        </Typography>
                      </div>
                    </IconButton>
                  </Link>
                </NextLink>
              </div>
            )}
            <div className={classes.toggle}>
              <ThemeToggleSwitch
                checked={darkMode}
                onChange={darkModeSwitchHandler}
              />
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>

        <AppBar
          position='static'
          className={
            theme.palette.type === 'dark'
              ? classes.darkNavbarBottom
              : classes.navbarBottom
          }
        >
          <Toolbar className={classes.toolbarBottom}>
            <div className={classes.flexDivBottom}>
              <NextLink href='/' passHref>
                <Link style={{ textDecoration: 'none' }}>
                  <IconButton
                    className={classes.navButtonWrapper}
                    aria-label='home'
                  >
                    <div className={classes.navButtonDiv}>
                      <HomeOutlinedIcon
                        className={
                          selectedNavHome
                            ? classes.selectedHomeIcon
                            : theme.palette.type === 'light'
                            ? classes.navButton
                            : classes.navButtonDark
                        }
                      />
                      <Typography
                        variant='h6'
                        component='h6'
                        className={
                          selectedNavHome
                            ? classes.selectedHomeText
                            : theme.palette.type === 'light'
                            ? classes.typography
                            : classes.typographyDark
                        }
                      >
                        Home
                      </Typography>
                    </div>
                  </IconButton>
                </Link>
              </NextLink>
            </div>
            <div className={classes.flexDivBottom}>
              <NextLink href='#' passHref>
                <Link style={{ textDecoration: 'none' }}>
                  <IconButton
                    className={classes.navButtonWrapper}
                    aria-label='categories'
                    onClick={sidebarOpenHandler}
                  >
                    <div className={classes.navButtonDiv}>
                      <CategoryOutlinedIcon
                        className={
                          activeCategories
                            ? classes.selectedCategoriesIcon
                            : theme.palette.type === 'light'
                            ? classes.navButton
                            : classes.navButtonDark
                        }
                      />
                      <Typography
                        variant='h6'
                        component='h6'
                        className={
                          activeCategories
                            ? classes.selectedCategoriesText
                            : theme.palette.type === 'light'
                            ? classes.typography
                            : classes.typographyDark
                        }
                      >
                        Categories
                      </Typography>
                    </div>
                  </IconButton>
                </Link>
              </NextLink>
            </div>
            {userInfo ? (
              <div className={classes.flexDivBotttom}>
                <IconButton
                  className={classes.navButtonWrapper}
                  aria-controls='customized-menu'
                  aria-haspopup='true'
                  aria-label='profile'
                  variant='text'
                  color='primary'
                  onClick={rightSidebarOpenHandler}
                >
                  <div className={classes.navButtonDiv}>
                    <PersonOutlineOutlinedIcon
                      className={
                        selectedNavPerson
                          ? classes.selectedPersonIcon
                          : theme.palette.type === 'light'
                          ? classes.navButton
                          : classes.navButtonDark
                      }
                    />
                    <Typography
                      variant='h6'
                      component='h6'
                      className={
                        selectedNavPerson
                          ? classes.selectedPersonText
                          : theme.palette.type === 'light'
                          ? classes.typography
                          : classes.typographyDark
                      }
                    >
                      {userInfo.firstName}
                    </Typography>
                  </div>
                </IconButton>
                <Drawer
                  anchor='right'
                  open={rightSidebarVisible}
                  onClose={rightSidebarCloseHandler}
                >
                  <List>
                    <ListItem style={{ marginLeft: -15 }}>
                      <IconButton
                        aria-label='close'
                        onClick={rightSidebarCloseHandler}
                      >
                        <CancelOutlinedIcon />
                      </IconButton>
                      <Typography variant='h3' style={{ marginLeft: 20 }}>
                        <strong>Hi, {userInfo.firstName}.</strong>
                      </Typography>
                    </ListItem>
                    <Divider />
                    <ListItem
                      onClick={userMenuCloseHandler}
                      style={{ cursor: 'pointer' }}
                    >
                      <ListItemIcon>
                        <AccountCircleOutlinedIcon fontSize='small' />
                      </ListItemIcon>
                      <NextLink href='/profile' passHref>
                        <ListItemText
                          disableTypography={true}
                          primary='Profile'
                        />
                      </NextLink>
                    </ListItem>
                    <ListItem
                      onClick={userMenuCloseHandler}
                      style={{ cursor: 'pointer' }}
                    >
                      <ListItemIcon>
                        <HistoryIcon fontSize='small' />
                      </ListItemIcon>
                      <NextLink
                        href={
                          userInfo.isAdmin ? '/admin/orders' : '/order_history'
                        }
                        passHref
                      >
                        <ListItemText
                          disableTypography={true}
                          primary='My Orders'
                        />
                      </NextLink>
                    </ListItem>
                    {userInfo.isAdmin && (
                      <ListItem
                        onClick={userMenuCloseHandler}
                        style={{ cursor: 'pointer' }}
                      >
                        <ListItemIcon>
                          <DashboardOutlinedIcon fontSize='small' />
                        </ListItemIcon>
                        <NextLink href='/admin/dashboard' passHref>
                          <ListItemText
                            disableTypography={true}
                            primary='Admin Dashboard'
                          />
                        </NextLink>
                      </ListItem>
                    )}
                    <ListItem
                      onClick={userLogoutHandler}
                      style={{ cursor: 'pointer' }}
                    >
                      <ListItemIcon>
                        <ExitToAppIcon fontSize='small' />
                      </ListItemIcon>
                      <ListItemText disableTypography={true} primary='Logout' />
                    </ListItem>
                  </List>
                </Drawer>
              </div>
            ) : (
              <div className={classes.flexDivBottom}>
                <NextLink href='/login' passHref>
                  <Link>
                    <IconButton
                      className={classes.navButtonWrapper}
                      aria-label='sign_in'
                    >
                      <div className={classes.navButtonDiv}>
                        <PersonOutlineOutlinedIcon
                          className={
                            theme.palette.type === 'light'
                              ? classes.navButton
                              : classes.navButtonDark
                          }
                        />
                        <Typography
                          variant='h6'
                          component='h6'
                          className={
                            theme.palette.type === 'light'
                              ? classes.typography
                              : classes.typographyDark
                          }
                        >
                          Sign In
                        </Typography>
                      </div>
                    </IconButton>
                  </Link>
                </NextLink>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </div>
  );
}
