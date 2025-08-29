import { ReactNode } from 'react';
import { BaseBoxProps } from '../Box/BaseBox';
import { DataAnalyticsAttribute, TestID } from '../../utils/types';
type CollapsibleBodyProps = {
    children: ReactNode;
    width?: BaseBoxProps['width'];
    /**
     * Internal
     *
     * Set to false to remove margin of CollapsibleBody
     */
    _hasMargin?: boolean;
} & DataAnalyticsAttribute & TestID;
type CollapsibleBodyContentProps = {
    children: ReactNode;
    _hasMargin?: CollapsibleBodyProps['_hasMargin'];
};
export type { CollapsibleBodyProps, CollapsibleBodyContentProps };
