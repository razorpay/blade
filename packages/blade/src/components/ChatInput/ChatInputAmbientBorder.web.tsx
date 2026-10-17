import styled, { keyframes } from 'styled-components';
import { chatInputAmbientBorder } from './chatInputTokens';
import { makeSpace } from '~utils';

const breathe = keyframes`
  0%, 100% { opacity: 0.55; background-position: 0% 50%; }
  50% { opacity: 0.95; background-position: 100% 50%; }
`;

// Private to ChatInput: this is an ambient affordance, never a loading or focus indicator.
const ChatInputAmbientBorder = styled.span<{ $colorScheme: 'light' | 'dark' }>`
  position: absolute;
  inset: -1px;
  z-index: 2;
  pointer-events: none;
  border-radius: ${({ theme }) => makeSpace(theme.border.radius.large)};

  &::before,
  &::after {
    content: none;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: ${chatInputAmbientBorder.width}px;
    background: ${({ $colorScheme }) => chatInputAmbientBorder[$colorScheme]};
    background-size: 240% 100%;
    /* The WebKit prefixed mask is required for the content-box cut-out on Safari. */
    /* stylelint-disable-next-line property-no-vendor-prefix -- Safari needs the prefixed property */
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    /* stylelint-disable-next-line property-no-vendor-prefix -- Safari uses a different composite keyword */
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
    filter: blur(${chatInputAmbientBorder.glowBlur}px);
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
      opacity: 0.7;
    }
  }

  @media (forced-colors: active) {
    display: none;
  }
`;

export { ChatInputAmbientBorder };
