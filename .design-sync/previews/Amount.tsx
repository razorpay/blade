import React from 'react';
import { Amount } from '@razorpay/blade/components';

export const Default = () => (
  <Amount value={12500.45} />
);

export const WithColor = () => (
  <>
    <Amount value={5000} color="feedback.text.positive.intense" />
    <Amount value={250} color="feedback.text.negative.intense" />
  </>
);

export const Sizes = () => (
  <>
    <Amount value={99999} type="body" size="small" />
    <Amount value={99999} type="body" size="medium" />
    <Amount value={99999} type="body" size="large" />
  </>
);

export const Currency = () => (
  <>
    <Amount value={1000} currency="INR" />
    <Amount value={1000} currency="USD" />
    <Amount value={1000} currency="EUR" />
  </>
);

export const HumanizeSuffix = () => (
  <>
    <Amount value={1234} suffix="humanize" />
    <Amount value={123456} suffix="humanize" />
    <Amount value={12345678} suffix="humanize" />
  </>
);

export const Strikethrough = () => (
  <Amount value={2999} isStrikethrough />
);
