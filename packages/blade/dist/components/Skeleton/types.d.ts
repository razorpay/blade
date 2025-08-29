import { BaseBoxProps } from '../Box/BaseBox';
import { FlexboxProps } from '../Box/BaseBox/types/propsTypes';
import { StyledPropsBlade } from '../Box/styledProps';
type SkeletonProps = StyledPropsBlade & Pick<BaseBoxProps, 'width' | 'maxWidth' | 'minWidth' | 'height' | 'maxHeight' | 'minHeight' | 'borderRadius'> & Partial<FlexboxProps> & {
    testID?: string;
};
export type { SkeletonProps };
