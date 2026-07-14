import styled, { css, keyframes } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';

type ButtonDotLoaderProps = {
  size: number;
  color: string;
  [key: string]: unknown;
};

const bounce = keyframes`
  20% { background-position: 0% 0%, 50% 50%, 100% 50% }
  40% { background-position: 0% 100%, 50% 0%, 100% 50% }
  60% { background-position: 0% 50%, 50% 100%, 100% 0% }
  80% { background-position: 0% 50%, 50% 50%, 100% 100% }
`;

const StyledDotLoader = styled(BaseBox)<ButtonDotLoaderProps>(
  ({ size, color }) => css`
    width: ${size * 2}px;
    height: ${size}px;
    --_g: no-repeat radial-gradient(circle closest-side, ${color} 90%, transparent);
    background: var(--_g) 0% 50%, var(--_g) 50% 50%, var(--_g) 100% 50%;
    background-size: calc(100% / 3) 50%;
    animation: ${bounce} 1s infinite linear;
  `,
);

const ButtonDotLoader = ({ size, color, ...rest }: ButtonDotLoaderProps): React.ReactElement => {
  return <StyledDotLoader size={size} color={color} {...rest} />;
};

export { ButtonDotLoader };
export type { ButtonDotLoaderProps };
