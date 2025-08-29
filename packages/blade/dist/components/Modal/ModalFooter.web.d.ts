import { default as React } from 'react';
import { BaseFooterProps } from '../BaseHeaderFooter/BaseFooter';
import { DataAnalyticsAttribute } from '../../utils/types';
type ModalFooterProps = Pick<BaseFooterProps, 'children' | keyof DataAnalyticsAttribute>;
declare const ModalFooter: (props: ModalFooterProps) => React.ReactElement;
export { ModalFooter };
export type { ModalFooterProps };
