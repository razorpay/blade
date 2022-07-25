import type { CSSObject } from 'styled-components';

export * from './Fade.web';

export type FadeProps = {
  show?: boolean;
  children: React.ReactNode;
  enter: string;
  leave: string;
  styles?: React.CSSProperties | CSSObject;
};
