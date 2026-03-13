import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import type { DotNotationToken } from '~utils/lodashButBetter/get';

type BouncyLoaderProps = {
  color: DotNotationToken<Theme['colors']>;
  dotSize?: number;
};

const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0px);
  }
  40% {
    transform: translateY(-2px);
  }
`;

const Dot = styled.span<{ delay: number; color: string; dotSize: number }>(
  ({ delay, color, dotSize }) => css`
    width: ${dotSize}px;
    height: ${dotSize}px;
    background-color: ${color};
    border-radius: 50%;
    display: inline-block;
    animation: ${bounce} 0.6s ease-in-out infinite;
    animation-delay: ${delay}ms;
  `,
);

const BouncyLoader = ({ color, dotSize = 4 }: BouncyLoaderProps): React.ReactElement => {
  const { theme } = useTheme();
  const resolvedColor = getIn(theme.colors, color);

  return (
    <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
      <Dot delay={0} color={resolvedColor} dotSize={dotSize} />
      <Dot delay={100} color={resolvedColor} dotSize={dotSize} />
      <Dot delay={200} color={resolvedColor} dotSize={dotSize} />
    </BaseBox>
  );
};

export { BouncyLoader };
export type { BouncyLoaderProps };
