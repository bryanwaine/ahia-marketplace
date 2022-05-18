import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from '../utils/styles';

const CheckoutWizard = ({ activeStep = 0 }) => {
  const classes = useStyles();
  return (
    <Stepper
      className={classes.transparentBackground}
      activeStep={activeStep}
      alternativeLabel
    >
      {['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (step) => (
          <Step key={step}>
            <StepLabel>
              <Typography variant='h6' style={{ margin: 0 }}>
                {step}
              </Typography>
            </StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
};

export default CheckoutWizard;
