import React from 'react';
import { Avatar, AvatarGroup, Indicator } from '@razorpay/blade/components';
import { BuildingIcon } from '@razorpay/blade/components';

export const WithImage = () => (
  <Avatar
    size="medium"
    src="https://avatars.githubusercontent.com/u/35374649?v=4"
    name="Nitin Kumar"
  />
);

export const WithInitials = () => <Avatar size="medium" name="Anurag Hazra" />;

export const WithIcon = () => <Avatar size="medium" icon={BuildingIcon} variant="square" />;

export const AllSizes = () => (
  <>
    <Avatar size="xsmall" name="AH" />
    <Avatar size="small" name="AH" />
    <Avatar size="medium" name="AH" />
    <Avatar size="large" name="AH" />
    <Avatar size="xlarge" name="AH" />
  </>
);

export const AllColors = () => (
  <>
    <Avatar size="medium" name="Primary" color="primary" />
    <Avatar size="medium" name="Positive" color="positive" />
    <Avatar size="medium" name="Negative" color="negative" />
    <Avatar size="medium" name="Notice" color="notice" />
  </>
);

export const WithIndicator = () => (
  <Avatar
    size="medium"
    name="Anurag Hazra"
    topAddon={<Indicator color="positive" />}
    src="https://avatars.githubusercontent.com/u/35374649?v=4"
  />
);

export const SquareVariant = () => (
  <Avatar size="medium" name="Company" variant="square" icon={BuildingIcon} />
);

export const Group = () => (
  <AvatarGroup size="medium">
    <Avatar name="Anurag Hazra" color="primary" />
    <Avatar name="Kamlesh Chandnani" color="positive" />
    <Avatar name="Rama Krushna" color="negative" />
    <Avatar name="Nitin Kumar" color="information" />
  </AvatarGroup>
);

export const GroupWithMaxCount = () => (
  <AvatarGroup size="medium" maxCount={3}>
    <Avatar name="Anurag Hazra" color="primary" />
    <Avatar name="Kamlesh Chandnani" color="positive" />
    <Avatar name="Rama Krushna" color="negative" />
    <Avatar name="Nitin Kumar" color="information" />
    <Avatar name="Chaitanya Deorukhkar" color="notice" />
  </AvatarGroup>
);
