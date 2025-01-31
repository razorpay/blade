import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import Rotate from './Rotate';

const ResponseMessageBubble = ({
  children,
  avatarIcon: AvatarIcon,
  avatarColor,
}: {
  children: React.ReactNode | string;
  avatarIcon: IconComponent;
  avatarColor?: string;
}): React.ReactElement => {
  return (
    <BaseBox maxWidth="296px">
      <BaseBox display="flex" gap="spacing.4" justifyContent="left">
        <BaseBox>
          {/* <Rotate> */}
          <AvatarIcon size="xlarge" color={avatarColor} margin="spacing.2" />
          {/* </Rotate> */}
        </BaseBox>
        <BaseBox display="flex" alignItems="center" maxWidth="256px">
          {children}
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

export { ResponseMessageBubble };
