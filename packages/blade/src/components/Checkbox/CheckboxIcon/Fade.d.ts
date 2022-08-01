import type { CSSObject } from 'styled-components';

export * from './Fade.web';

export type FadeProps = {
  show?: boolean;
  children: React.ReactNode;
  styles?: React.CSSProperties | CSSObject;
};
