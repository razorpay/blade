import React from 'react';
import styled from 'styled-components';
import { metaAttribute, MetaConstants, testID } from '~utils';
import { screenReaderStyles } from '~components/VisuallyHidden/ScreenReaderStyles';
import { BaseLink } from '~components/Link/BaseLink';

const fallbackId = 'blade-skip-nav';
type SkipNavLinkProps = {
  id?: string;
  children?: string;
};

const StyledLink = styled(BaseLink)(({ theme }) => ({
  ...screenReaderStyles,
  top: theme.spacing[5],
  left: theme.spacing[5],
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
  return <StyledLink href={`#${id}`}>{children}</StyledLink>;
};

type SkipNavContentProps = {
  id?: string;
};

const SkipNavContent = ({ id = fallbackId }: SkipNavContentProps): JSX.Element => {
  return (
    <div
      tabIndex={-1}
      id={id}
      style={{ outline: 0 }}
      {...testID('skipnav-content')}
      {...metaAttribute(MetaConstants.Component, MetaConstants.SkipNav)}
    />
  );
};

export { SkipNavLink, SkipNavContent };
