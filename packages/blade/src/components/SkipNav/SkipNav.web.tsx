import React from 'react';
import styled from 'styled-components';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { screenReaderStyles } from '~components/VisuallyHidden/ScreenReaderStyles';
import { BaseLink } from '~components/Link/BaseLink';
import type { StringChildrenType, TestID } from '~utils/types';

const fallbackId = 'blade-skip-nav';
type SkipNavLinkProps = {
  id?: string;
  children?: StringChildrenType;
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
} & TestID;

const SkipNavContent = ({
  id = fallbackId,
  testID = 'skipnav-content',
}: SkipNavContentProps): JSX.Element => {
  return (
    <div
      tabIndex={-1}
      id={id}
      style={{ outline: 0 }}
      {...metaAttribute({ name: MetaConstants.SkipNav, testID })}
    />
  );
};

export { SkipNavLink, SkipNavContent };
