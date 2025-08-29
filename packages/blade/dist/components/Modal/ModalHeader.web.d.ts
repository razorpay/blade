import { BaseHeaderProps } from '../BaseHeaderFooter/BaseHeader';
import { DataAnalyticsAttribute } from '../../utils/types';
type ModalHeaderProps = Pick<BaseHeaderProps, 'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix' | keyof DataAnalyticsAttribute>;
declare const ModalHeader: ({ leading, subtitle, title, titleSuffix, trailing, ...rest }: ModalHeaderProps) => React.ReactElement;
export { ModalHeader };
export type { ModalHeaderProps };
