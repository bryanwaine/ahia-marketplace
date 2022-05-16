import { Typography } from '@material-ui/core';
import React from 'react'
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

const Link_Expired = () => {
  return (
    <div style={{margin: '0 50px'}}>
      <Typography
        component='h2'
        variant='h2'
        style={{ fontWeight: 500, marginBottom: 20 }}
      >
        Expired Link
      </Typography>
      <div style={{display: 'flex', alignItems: 'center' }}><Typography variant='p'>This link is expired.</Typography>
      <BrokenImageIcon fontSize='large'/></div>
      
    </div>
  );
}

export default Link_Expired