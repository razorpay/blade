import React from 'react';
import { StepGroup, StepItem, StepItemIcon, StepItemIndicator } from '@razorpay/blade/components';
import { CheckIcon, CloseIcon, InfoIcon } from '@razorpay/blade/components';

export const Default = () => (
  <StepGroup>
    <StepItem
      marker={<StepItemIcon icon={CheckIcon} color="positive" />}
      title="Payment Completed"
      description="Your payment has been successfully processed"
    />
  </StepGroup>
);

export const MultipleSteps = () => (
  <StepGroup>
    <StepItem
      marker={<StepItemIcon icon={CheckIcon} color="positive" />}
      title="Order Placed"
      timestamp="Mon 10th Jun, 2024"
      description="Your order has been confirmed"
    />
    <StepItem
      marker={<StepItemIcon icon={CheckIcon} color="positive" />}
      title="Payment Verified"
      timestamp="Mon 10th Jun, 2024"
      description="Payment verification successful"
    />
    <StepItem
      marker={<StepItemIcon icon={InfoIcon} color="information" />}
      title="Processing"
      timestamp="Mon 10th Jun, 2024"
      description="Your order is being processed"
    />
  </StepGroup>
);

export const DifferentColors = () => (
  <StepGroup>
    <StepItem
      marker={<StepItemIcon icon={CheckIcon} color="positive" />}
      title="Success Step"
      description="Completed successfully"
    />
    <StepItem
      marker={<StepItemIcon icon={InfoIcon} color="information" />}
      title="Info Step"
      description="Additional information"
    />
    <StepItem
      marker={<StepItemIcon icon={CloseIcon} color="negative" />}
      title="Failed Step"
      description="Action failed"
    />
  </StepGroup>
);

export const WithIndicator = () => (
  <StepGroup>
    <StepItem
      marker={<StepItemIcon icon={CheckIcon} color="positive" />}
      title="Completed"
      description="This step is done"
    />
    <StepItem
      marker={<StepItemIndicator color="neutral" />}
      title="In Progress"
      description="Currently working on this"
    />
    <StepItem
      marker={<StepItemIndicator color="neutral" />}
      title="Upcoming"
      description="Not started yet"
    />
  </StepGroup>
);
