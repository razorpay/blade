/* eslint-disable react/react-in-jsx-scope */

import type { CSSProperties, ReactElement } from 'react';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type RazorSenseFallbackProps = StyledPropsBlade & {
  src: string;
  objectPosition?: CSSProperties['objectPosition'];
};

const RazorSenseFallback = ({
  src,
  objectPosition = 'center',
  ...styledProps
}: RazorSenseFallbackProps): ReactElement => (
  <BaseBox width="100%" height="100%" {...getStyledProps(styledProps)}>
    <img
      crossOrigin="anonymous"
      src={src}
      alt=""
      aria-hidden="true"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition,
      }}
    />
  </BaseBox>
);

export { RazorSenseFallback };
export type { RazorSenseFallbackProps };
