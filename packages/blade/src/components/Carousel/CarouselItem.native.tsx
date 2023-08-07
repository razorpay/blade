/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import styled from 'styled-components';
import React from 'react';
import { useCarouselContext } from './CarouselContext';
import BaseBox from '~components/Box/BaseBox';

const StyledCarouselItem = styled(BaseBox)(() => {
  return {};
});

type CarouselItemProps = {
  children: React.ReactNode;
};

const CarouselItem = ({ children }: CarouselItemProps): React.ReactElement => {
  const { boxWidth } = useCarouselContext();

  return (
    <StyledCarouselItem
      width={boxWidth}
      margin="spacing.0"
      paddingLeft="spacing.4"
      paddingRight="spacing.4"
    >
      {children}
    </StyledCarouselItem>
  );
};

export { CarouselItem };
