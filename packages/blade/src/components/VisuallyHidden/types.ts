import type { TestID } from '~src/_helpers/types';

export type VisuallyHiddenProps = {
  children: React.ReactNode;
} & TestID;
