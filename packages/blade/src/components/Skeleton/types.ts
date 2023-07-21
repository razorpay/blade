import type { BaseBoxProps } from '../../components/Box/BaseBox';
import type { FlexboxProps } from '../../components/Box/BaseBox/types/propsTypes';
import type { StyledPropsBlade } from '../../components/Box/styledProps';

type SkeletonProps = StyledPropsBlade &
  Pick<
    BaseBoxProps,
    'width' | 'maxWidth' | 'minWidth' | 'height' | 'maxHeight' | 'minHeight' | 'borderRadius'
  > &
  Partial<FlexboxProps> & {
    contrast?: 'low' | 'high';
    testID?: string;
  };

export type { SkeletonProps };
