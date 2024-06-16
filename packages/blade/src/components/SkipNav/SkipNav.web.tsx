import React from 'react';
import styled from 'styled-components';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { screenReaderStyles } from '~components/VisuallyHidden/ScreenReaderStyles';
import { BaseLink } from '~components/Link/BaseLink';
import type { StringChildrenType, TestID } from '~utils/types';
import { makeSpace } from '~utils';

const fallbackId = 'blade-skip-nav';
type SkipNavLinkProps = {
  id?: string;
  children?: StringChildrenType;
  /**
   * **Internal**
   *
   * Adds background to link. Used internally in SideNav
   */
  _hasBackground?: boolean;
};

const StyledLink = styled(BaseLink)<Pick<SkipNavLinkProps, '_hasBackground'>>(
  ({ theme, _hasBackground }) => ({
    ...screenReaderStyles,
    top: theme.spacing[5],
    left: theme.spacing[5],
    backgroundColor: _hasBackground ? theme.colors.surface.background.gray.intense : undefined,
    zIndex: _hasBackground ? 1 : undefined,
    ':focus': {
      padding: makeSpace(theme.spacing[2]),
      clip: 'auto',
      clipPath: 'unset',
      width: 'auto',
      height: 'auto',
    },
  }),
);

const SkipNavLink = ({
  id = fallbackId,
  children = 'Skip to content',
  _hasBackground = false,
}: SkipNavLinkProps): React.ReactElement => {
  return (
    <StyledLink href={`#${id}`} _hasBackground={_hasBackground}>
      {children}
    </StyledLink>
  );
};

type SkipNavContentProps = {
  id?: string;
} & TestID;

const SkipNavContent = ({
  id = fallbackId,
  testID = 'skipnav-content',
}: SkipNavContentProps): React.ReactElement => {
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
