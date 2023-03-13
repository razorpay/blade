import type { TestID } from '~src/_helpers/types';

export type SvgProps = {
  children: React.ReactNode;
  fill?: string;
  height: string;
  viewBox: string;
  width: string;
} & TestID;
