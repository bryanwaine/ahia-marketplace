import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  navbar: {
    position: 'sticky !important',
    top: '0px !important',
    padding: 5,
    background: '#eeeeee !important',
    '& a': {
      color: '#aaaaaa !important',
    },
  },
  darkNavbar: {
    position: 'sticky !important',
    top: '0px !important',
    padding: 5,
    background: '#04111d !important',
    '& a': {
      color: '#ffffff !important',
    },
  },
  navbarBottom: {
    position: 'sticky !important',
    bottom: '0px !important',
    marginTop: 30,
    paddingTop: 5,
    background: '#eeeeee !important',
    boxShadow: '0px -4px 14px -6px rgba(0,0,0,0.54) !important',
    webkitBoxShadow: '0px -4px 14px -6px rgba(0,0,0,0.54) !important',
    mozBoxShadow: '0px -4px 14px -6px rgba(0,0,0,0.54) !important',
    '& a': {
      color: '#aaaaaa !important',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'none !important',
    },
  },
  darkNavbarBottom: {
    position: 'sticky !important',
    bottom: '0px !important',
    marginTop: 30,
    paddingTop: 5,
    background: '#04111d !important',
    boxShadow: '0px -4px 14px -6px rgba(0,0,0,0.54) !important',
    webkitBoxShadow: '0px -4px 14px -6px rgba(0,0,0,0.54) !important',
    mozBoxShadow: '0px -4px 14px -6px rgba(0,0,0,0.54) !important',
    '& a': {
      color: '#aaaaaa !important',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'none !important',
    },
  },
  ahia: {
    display: 'flex',
    cursor: 'pointer',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  cart: {
    fontSize: '1.5rem',
  },
  contentMaxHeight: {
    minHeight: 90,
    textOverflow: 'ellipses',
  },
  counter: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  counterBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    padding: '3px 0 !important',
  },
  counterBtnSlug: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px 0 !important',
  },
  divider: {
    background: '#aaaaaa',
    width: '100%',
    height: 1,
  },
  empty_cart: {
    display: 'flex',
    justifyContent: 'center',
  },
  empty_grid: {
    height: 50,
  },
  login: {
    fontSize: '1.5rem',
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
    '& a': {
      color: '#aaaaaa',
    },
    position: 'sticky',
    top: '100vh',
  },
  cartSection: {
    display: 'flex',
    alignItems: 'center',
  },
  slugSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  badge: {
    zIndex: '1000 !important',
    '& .MuiBadge-badge': {
      border: `1px solid #ffffff`,
      padding: '0 4px',
    },
  },
  barMobile: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      display: 'none !important',
    },
  },
  barTab: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'none !important',
    },
  },
  barFull: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('lg')]: {
      display: 'none !important',
    },
  },
  buttonPrimary: {
    backgroundColor: 'primary',
    color: '#ffffff',
  },
  buttonSecondary: {
    backgroundColor: '#208080',
    color: '#fff',
  },
  buttonBack: {
    backgroundColor: '#aaaaaa',
    color: '#fff',
  },
  btnIncrement: {
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ff0000',
    cursor: 'pointer',
    borderRadius: '0 5px 5px 0',
    color: '#ffffff',
    zIndex: 1000,
  },
  btnDecrement: {
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ff0000',
    cursor: 'pointer',
    borderRadius: '5px 0 0 5px',
    color: '#ffffff',

    zIndex: 1000,
  },
  btnDiv: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 15,
    marginBottom: 7,
  },
  display: {
    display: 'flex',
    height: 30,
    justifyContent: 'end',
    borderTop: '1px solid #ff0000',
    borderBottom: '1px solid #ff0000',
    padding: '3px 15px 0',
    zIndex: 1000,
  },
  link: {
    color: 'primary',
    padding: '0 5px !important',
    margin: '0 !important',
  },
  centeredLink: {
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 15,
    width: 'auto',
  },
  centeredText: {
    textAlign: 'center',
    marginTop: 15,
  },
  cP: {
    fontSize: '10px !important',
    width: 10,
    height: 10,
  },
  divContainer: {
    display: 'flex',
  },
  divSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  error: {
    color: '#f04040',
  },
  form: {
    maxWidth: 500,
    margin: '0 auto',
  },
  flexDiv: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 10,
    width: 'auto',
    height: '100%',
    textTransform: 'initial',
    [theme.breakpoints.down('md')]: {
      display: 'none !important',
    },
  },
  flexDivBottom: {
    display: 'flex',
    alignItems: 'center',
    width: 'auto',
    height: '100%',
    textTransform: 'initial',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'end !important',
    },
  },
  toolbarBottom: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  hideHamburger: {
    [theme.breakpoints.down('md')]: {
      display: 'none !important',
    },
  },
  flexNumDiv: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'space-between',
  },
  greenText: {
    color: '#34eb40',
    fontWeight: 700,
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  modalBox: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    margin: '0 auto',
    background: '#ffffff !important',
    border: '1px solid #ffffff',
    borderRadius: 5,
    boxShadow: 24,
    padding: 20,
    outline: 'none !important',
    [theme.breakpoints.down('xs')]: {
      top: '35% !important',
    },
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  modalText: {
    color: '#111111 !important',
  },
  navButtonCart: {
    textTransform: 'initial',
    '&:hover': {
      background: 'transparent !important',
      color: '#ed6c02 !important',
    },
  },
  iconButton: {
    '&:hover': {
      background: 'transparent !important',
    },
  },
  navBarSearchDiv: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'none !important',
    },
  },
  navBarSearchFull: {
    border: '1px solid #aaaaaa',
    borderRadius: 10,
    marginRight: 20,
    marginTop: 5,
    width: '90%',
    height: 50,
  },
  navBarSearch: {
    border: 'none',
    borderRadius: 10,
    marginRight: 20,
    marginTop: 5,
    width: '90%',
    height: 50,
  },
  navBarSearchForm: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  navBarSearchInputFull: {
    width: '100%',
    color: '#111111',
    paddingLeft: 20,
    '& ::placeholder': { color: '#111111' },
  },
  navBarSearchInputFullDark: {
    width: '100%',
    color: '#ffffff',
    paddingLeft: 20,
    '& ::placeholder': { color: '#ffffff' },
  },
  navBarSearchInput: {
    width: '100%',
    color: '#111111',
    '& ::placeholder': { color: '#111111' },
  },
  navBarSearchInputDark: {
    width: '100%',
    color: '#ffffff',
    '& ::placeholder': { color: '#ffffff' },
  },
  navButtonSearch: {
    color: '#ffffff',
    textTransform: 'initial',
    flexGrow: 1,
    '&:hover': {
      background: 'transparent',
      color: '#ed6c02 !important',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'none !important',
    },
  },
  navBarSearchDrawer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0 0 0',
    background: '#eeeeee',
    height: '77px',
  },
  navBarSearchDrawerDark: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0 0 0',
    background: '#04111d',
    height: '77px',
  },
  navBarSearchDrawerParent: {
    padding: 10,
    '& .MuiDrawer-paper': {
      background: 'transparent',
      border: 'none !important',
      boxShadow: 'none !important',
      height: '77px',
    },
    '& .MuiDrawer-paperAnchorLeft': {
      right: '0 !important',
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'transparent',
    },
  },
  navBarSearchClose: {
    marginBottom: 15,
    '&:hover': {
      background: 'transparent !important',
    },
  },
  searchIconButton: {
    '&:hover': {
      background: 'transparent !important',
      color: '#ed6c02 !important',
    },
  },
  backArrowIconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 0 10px 15px !important',
    '&:hover': { background: 'transparent !important' },
  },
  navButtonWrapper: {
    textTransform: 'initial',
    borderRadius: '50%',
    '&:hover': {
      background: 'transparent !important',
      color: '#ed6c02 !important',
    },
  },
  navButton: {
    color: '#111111 !important',
  },
  navButtonDark: {
    color: '#ffffff !important',
  },
  navButtonDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      background: 'transparent !important',
      color: '#ed6c02 !important',
    },
  },
  navGrid: {
    display: 'flex',
  },
  noDisplay: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  noButton: {
    display: 'none',
  },
  redText: {
    color: '#eb3434',
    fontWeight: 700,
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  prefix: {
    marginRight: 20,
    marginBottom: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  prefixTop: {
    fontSize: 13,
    margin: '0 0 -15px 0'
  },
  reviewForm: {
    maxWidth: 500,
    width: '100%',
  },
  reviewItems: {
    marginRight: '1rem',
    paddingRight: '1rem',
    borderRight: '1px solid #808080',
  },
  section: {
    marginTop: 20,
  },
  selectedHomeIcon: {
    color: '#ff0000 !important',
  },
  selectedPersonIcon: {
    color: '#ff0000 !important',
  },
  selectedCartIcon: {
    color: '#ff0000 !important',
  },
  selectedCategoriesIcon: {
    color: '#ff0000 !important',
  },
  selectedSearchIcon: {},
  selectedHomeText: {
    color: '#ff0000 !important',
    fontWeight: 400,
    cursor: 'pointer',
    margin: '0 !important',
    display: 'flex',
    justifyContent: 'center',
  },
  selectedPersonText: {
    color: '#ff0000 !important',
    fontWeight: 400,
    cursor: 'pointer',
    margin: '0 !important',
    display: 'flex',
    justifyContent: 'center',
  },
  selectedCartText: {
    color: '#ff0000 !important',
    fontWeight: 400,
    cursor: 'pointer',
    margin: '0 !important',
    display: 'flex',
    justifyContent: 'center',
  },
  selectedCategoriesText: {
    color: '#ff0000 !important',
    fontWeight: 400,
    cursor: 'pointer',
    margin: '0 !important',
    display: 'flex',
    justifyContent: 'center',
  },
  selectedSearchText: {
    fontWeight: 400,
    cursor: 'pointer',
    margin: '0 !important',
    display: 'flex',
    justifyContent: 'center',
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
  },
  typography: {
    fontWeight: 300,
    color: '#111111',
    cursor: 'pointer',
    margin: '0 !important',
    display: 'flex',
    justifyContent: 'center',
  },
  typographyDark: {
    fontWeight: 300,
    color: '#ffffff',
    cursor: 'pointer',
    margin: '0 !important',
    display: 'flex',
    justifyContent: 'center',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
    fontWeight: 300,
  },
  textFieldFont: {
    '&::placeholder': {
      fontSize: '0.8rem',
      fontWeight: 300,
    },
  },
  loadingModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 51,
    margin: 'auto',
    borderRadius: 50,
    padding: '5px 0 0 3.5px',
    outline: 'none !important',

    '& .MuiCircularProgress-colorPrimary': {
      color: '#ff0000 !important',
      background: '#ff0000',
    },
  },
  modalLogo: {
    zIndex: 1000,
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 51,
    margin: 'auto',
    borderRadius: 50,
    padding: '5px 0 0 3.5px',
    outline: 'none !important',
  },
  buttonLoading: {
    '& .MuiCircularProgress-colorPrimary': {
      color: '#ff0000 !important',
    },
  },
  radio: {
    '& .MuiSvgIcon-root': {
      color: '#01464a',
    },
  },
}));

export default useStyles;
