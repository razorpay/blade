import styled, { keyframes } from 'styled-components';
import { makeSpace } from '~utils';

const breathe = keyframes`
  0%, 100% { opacity: 0.45; background-position: 0% 50%; }
  50% { opacity: 0.8; background-position: 100% 50%; }
`;

// Private to ChatInput: this is an ambient affordance, never a loading or focus indicator.
const ChatInputAmbientBorder = styled.span`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: ${({ theme }) => makeSpace(theme.border.radius.large)};

  &::before,
  &::after {
    content: none;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: ${({ theme }) => makeSpace(theme.border.width.thin)};
    background: ${({ theme }) =>
      `linear-gradient(110deg, ${theme.colors.surface.border.primary.muted}, ${theme.colors.surface.border.primary.normal}, ${theme.colors.surface.border.primary.muted}, ${theme.colors.surface.border.primary.normal}, ${theme.colors.surface.border.primary.muted})`};
    background-size: 200% 100%;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    animation: ${breathe} 5s ease-in-out infinite;
  }

  @supports (mask-composite: exclude) or (-webkit-mask-composite: xor) {
    &::before,
    &::after {
      content: '';
    }
  }

  &::after {
    filter: blur(4px);
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
      opacity: 0.6;
    }
  }

  @media (forced-colors: active) {
    display: none;
  }
`;

export { ChatInputAmbientBorder };
