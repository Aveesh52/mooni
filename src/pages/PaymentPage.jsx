import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Box, Step } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { useViewport, Box as ABox } from '@aragon/ui'

import StepRecipient from '../components/StepRecipient';
import StepPaymentDetail from '../components/StepPaymentDetail';
import StepContact from '../components/StepContact';
import StepRecap from '../components/StepRecap';
import StepStatus from '../components/StepStatus';
import Footer from '../components/Footer';

import { CustomStepper, CustomStepConnector, CustomStepIcon, CustomLabel, CustomMobileStepper } from '../components/StepComponents';

import { createOrder, sendPayment, resetOrder } from '../redux/payment/actions';

const useStyles = makeStyles({
  mobileStepperRoot: {
    maxWidth: 400,
    flexGrow: 1,
  },
  mobileStepperStepLabel: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
    textTransform: 'uppercase',
    marginBottom: '14px',
  }
});

function PaymentPage() {
  const history = useHistory();
  const [stepId, setActiveStep] = useState(0);
  const { below, above } = useViewport();
  const classes = useStyles();

  const dispatch = useDispatch();

  function onExit() {
    history.push('/');
  }
  function handleNext() {
    setActiveStep(stepId + 1);
  }
  function handleBack() {
    setActiveStep(stepId - 1);
  }
  function onEditRecap() {
    dispatch(resetOrder());
    setActiveStep(2);
  }
  function onPrepareRecap() {
    dispatch(resetOrder());
    dispatch(createOrder());
    handleNext();
  }
  function onSend() {
    dispatch(sendPayment());
    handleNext();
  }

  const steps = ['Recipient', 'Payment Details', 'Contact', 'Recap', 'Status'];
  const stepElements = [
    <StepRecipient onComplete={handleNext} />,
    <StepPaymentDetail onComplete={handleNext} onBack={handleBack} />,
    <StepContact onComplete={onPrepareRecap} onBack={handleBack} />,
    <StepRecap onComplete={onSend} onBack={onEditRecap} />,
    <StepStatus onExit={onExit} onBack={onEditRecap} />,
  ];

  return (
    <>
      <ABox width={1} py={3}>
        { below('medium') &&
        <>
          <CustomMobileStepper
            activeStep={stepId}
            steps={stepElements.length}
            variant="dots"
            position="static"
            className={classes.mobileStepperRoot}
            nextButton={<div></div>}
            backButton={<div></div>}
          />
          <Box textAlign="center" className={classes.mobileStepperStepLabel}>
            {steps[stepId]}
          </Box>
        </>
        }
        { above('medium') &&
        <CustomStepper alternativeLabel activeStep={stepId} connector={<CustomStepConnector />}>
          {steps.map(label => (
            <Step key={label}>
              <CustomLabel StepIconComponent={CustomStepIcon}>{label}</CustomLabel>
            </Step>
          ))}
        </CustomStepper>
        }
        {stepElements[stepId]}
      </ABox>
      <Footer />
    </>
  );
}

export default PaymentPage;
