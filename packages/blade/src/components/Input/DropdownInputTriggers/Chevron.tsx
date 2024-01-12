import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';

const Chevron = (props: { isOpen?: boolean; isDisabled?: boolean }): React.ReactElement => {
  const iconColor = `surface.icon.gray.${props.isDisabled ? 'disabled' : 'muted'}` as const;

  return (
    <>
      <ChevronDownIcon display={props.isOpen ? 'none' : 'flex'} size="medium" color={iconColor} />
      <ChevronUpIcon display={props.isOpen ? 'flex' : 'none'} size="medium" color={iconColor} />
    </>
  );
};

export { Chevron };
