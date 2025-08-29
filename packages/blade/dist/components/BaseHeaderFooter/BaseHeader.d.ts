import { default as React } from 'react';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { DividerProps } from '../Divider';
import { DataAnalyticsAttribute, TestID } from '../../utils/types';
import { BoxProps } from '../Box';
type BaseHeaderProps = {
    title?: string;
    subtitle?: string;
    /**
     * Leading part of the header placed at the left most side of the header
     */
    leading?: React.ReactNode;
    /**
     * Trailing part of the header placed at the right most side of the header
     */
    trailing?: React.ReactNode;
    /**
     * Placed adjacent to the title text
     */
    titleSuffix?: React.ReactNode;
    /**
     * @default true
     */
    showDivider?: boolean;
    /**
     * @default false
     */
    showBackButton?: boolean;
    /**
     * Slot for rendering any trailing interaction element into BaseHeader.
     *
     * E.g. Used in accordion to render CollapsibleChevronIcon
     */
    trailingInteractionElement?: React.ReactNode;
    /**
     * Decides size of the Header
     */
    size?: 'xlarge' | 'large' | 'medium';
    /**
     * @default true
     */
    showCloseButton?: boolean;
    /**
     * Disabled state of BaseHeader
     *
     * @default false
     */
    isDisabled?: boolean;
    paddingX?: BoxProps['paddingX'];
    marginY?: BoxProps['marginY'];
    marginTop?: BoxProps['marginTop'];
    marginBottom?: BoxProps['marginBottom'];
    alignItems?: BoxProps['alignItems'];
    dividerProps?: DividerProps;
    onCloseButtonClick?: () => void;
    onBackButtonClick?: () => void;
    closeButtonRef?: React.MutableRefObject<any>;
    backButtonRef?: React.MutableRefObject<any>;
    metaComponentName?: string;
    /**
     * inner child of BottomSheetHeader. Meant to be used for AutoComplete only
     */
    children?: React.ReactElement | React.ReactElement[];
    /**
     * Background image of the header
     *
     * You can use this for adding gradients.
     */
    backgroundImage?: BoxProps['backgroundImage'];
    /**
     * So we add a wrapper with custom styles in elements like leading, trailing interaction elements and trailing.
     * this props allows you to control that.
     *
     * For example, in Accordion, we add a wrapper with flex to center the icon (in some cases)
     *
     * @default false
     */
    shouldAlignLeadingAndTrailingElementsToCenter?: boolean;
} & Pick<ReactDOMAttributes, 'onClickCapture' | 'onKeyDown' | 'onKeyUp' | 'onLostPointerCapture' | 'onPointerCancel' | 'onPointerDown' | 'onPointerMove' | 'onPointerUp'> & TestID & DataAnalyticsAttribute;
declare const BaseHeader: ({ title, subtitle, leading, titleSuffix, trailing, showDivider, showBackButton, showCloseButton, onBackButtonClick, onCloseButtonClick, closeButtonRef, backButtonRef, testID, onClickCapture, onKeyDown, onKeyUp, onLostPointerCapture, onPointerCancel, onPointerDown, onPointerMove, onPointerUp, metaComponentName, paddingX, marginY, marginBottom, marginTop, size, isDisabled, children, trailingInteractionElement, backgroundImage, alignItems, dividerProps, shouldAlignLeadingAndTrailingElementsToCenter, ...rest }: BaseHeaderProps) => React.ReactElement;
export type { BaseHeaderProps };
export { BaseHeader };
