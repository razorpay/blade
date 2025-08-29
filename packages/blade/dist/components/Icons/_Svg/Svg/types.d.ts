import { StyledPropsBlade } from '../../../Box/styledProps';
import { TestID } from '../../../../utils/types';
export type SvgProps = {
    children: React.ReactNode;
    fill?: string;
    height: string;
    viewBox: string;
    width: string;
    fillOpacity?: number;
} & TestID & Omit<StyledPropsBlade, 'order' | 'visibility'>;
