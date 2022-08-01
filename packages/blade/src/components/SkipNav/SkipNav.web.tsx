import React from 'react';
import styled from 'styled-components';
import { testID } from '~utils';
import BaseText from '~components/Typography/BaseText';
import { screenReaderStyles } from '~components/VisuallyHidden/ScreenReaderStyles';

const fallbackId = 'blade-skip-nav';
type SkipNavLinkProps = {
  id?: string;
  children?: string;
};

// TODO: Replace with Link component
const StyledLink = styled.a(({ theme }) => ({
  ...screenReaderStyles,
  background: theme.colors.action.background.tertiary.default,
  top: theme.spacing[6],
  left: theme.spacing[6],
  color: theme.colors.action.text.link.default,
  ':focus': {
    padding: theme.spacing[2],
    clip: 'auto',
    clipPath: 'unset',
    width: 'auto',
    height: 'auto',
  },
}));

const SkipNavLink = ({
  id = fallbackId,
  children = 'Skip to content',
}: SkipNavLinkProps): JSX.Element => {
  return (
    <StyledLink href={`#${id}`}>
      <BaseText color="action.text.link.default" lineHeight="s">
        {children}
      </BaseText>
    </StyledLink>
  );
};

type SkipNavContentProps = {
  id?: string;
};

const SkipNavContent = ({ id = fallbackId }: SkipNavContentProps): JSX.Element => {
  return <div tabIndex={-1} id={id} style={{ outline: 0 }} {...testID('skipnav-content')} />;
};

export { SkipNavLink, SkipNavContent };
