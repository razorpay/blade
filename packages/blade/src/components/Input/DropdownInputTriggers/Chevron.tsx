import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';

const Chevron = (props: { isOpen?: boolean; isDisabled?: boolean }): React.ReactElement => {
  const iconColor = `surface.text.${
    props.isDisabled ? 'placeholder' : 'normal'
  }.lowContrast` as const;

  return (
    <>
      <ChevronDownIcon display={props.isOpen ? 'none' : 'flex'} size="medium" color={iconColor} />
      <ChevronUpIcon display={props.isOpen ? 'flex' : 'none'} size="medium" color={iconColor} />
    </>
  );
};

export { Chevron };
