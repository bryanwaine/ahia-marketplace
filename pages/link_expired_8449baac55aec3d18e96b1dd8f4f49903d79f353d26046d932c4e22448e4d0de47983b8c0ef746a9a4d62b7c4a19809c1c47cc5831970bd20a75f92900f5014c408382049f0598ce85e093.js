import { Typography } from '@material-ui/core';
import React from 'react'

const Link_Expired = () => {
  return (
    <div>
      <Typography
        component='h2'
        variant='h2'
        style={{ fontWeight: 500, marginBottom: 20 }}
      >
        Expired Link
      </Typography>
      <Typography variant='p'>This link is expired.</Typography>
    </div>
  );
}

export default Link_Expired