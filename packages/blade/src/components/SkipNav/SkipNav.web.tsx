import React from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import testId from '../../utils/testId';
import BaseText from '../Typography/BaseText';

const fallbackId = 'blade-skip-nav';
// remove once VisuallyHidden is merged
const screenReaderStyles: CSSObject = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '0 -1px -1px 0',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
};

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
  return <div tabIndex={-1} id={id} style={{ outline: 0 }} {...testId('skipnav-content')} />;
};

export { SkipNavLink, SkipNavContent };
