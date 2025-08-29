import { default as React } from 'react';
import { GestureResponderEvent } from 'react-native';
import { CardSpacingValueType } from './types';
import { StyledPropsBlade } from '../Box/styledProps';
import { DataAnalyticsAttribute, BladeElementRef, TestID } from '../../utils/types';
import { Elevation } from '../../tokens/global';
import { BoxProps } from '../Box';
import { Platform } from '../../utils';
import { Theme } from '../BladeProvider';
import { DotNotationToken } from '../../utils/lodashButBetter/get';
export declare const ComponentIds: {
    CardHeader: string;
    CardHeaderTrailing: string;
    CardHeaderLeading: string;
    CardFooter: string;
    CardFooterTrailing: string;
    CardFooterLeading: string;
    CardBody: string;
    CardHeaderIcon: string;
    CardHeaderCounter: string;
    CardHeaderBadge: string;
    CardHeaderAmount: string;
    CardHeaderText: string;
    CardHeaderLink: string;
    CardHeaderIconButton: string;
};
type CardSurfaceBackgroundColors = `surface.background.gray.${DotNotationToken<Theme['colors']['surface']['background']['gray']>}`;
export type CardProps = {
    /**
     * Card contents
     */
    children: React.ReactNode;
    /**
     * Sets the background color of the Card
     *
     * @default `surface.background.gray.intense`
     */
    backgroundColor?: CardSurfaceBackgroundColors;
    /**
     * Sets the border radius of the Card
     *
     * @default `medium`
     */
    borderRadius?: Extract<BoxProps['borderRadius'], 'medium' | 'large' | 'xlarge'>;
    /**
     * Sets the elevation for Cards
     *
     * eg: `theme.elevation.midRaised`
     *
     * @default `theme.elevation.lowRaised`
     *
     * **Links:**
     * - Docs: https://blade.razorpay.com/?path=/docs/tokens-elevation--docs
     */
    elevation?: keyof Elevation;
    /**
     * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
     * @default `spacing.7`
     *
     * **Links:**
     * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--docs
     */
    padding?: CardSpacingValueType;
    /**
     * Sets the width of the card
     */
    width?: BoxProps['width'];
    /**
     * Sets the height of the card
     */
    height?: BoxProps['height'];
    /**
     * Sets minimum height of the card
     */
    minHeight?: BoxProps['minHeight'];
    /**
     * Sets minimum width of the card
     */
    minWidth?: BoxProps['minWidth'];
    /**
     * Sets maximum width of the card
     */
    maxWidth?: BoxProps['maxWidth'];
    /**
     * If `true`, the card will be in selected state
     * Card will have a primary color border around it.
     *
     * @default false
     */
    isSelected?: boolean;
    /**
     * Makes the Card linkable by setting the `href` prop
     *
     * @default undefined
     */
    href?: string;
    /**
     * Sets the `target` attribute for the linkable card
     */
    target?: string;
    /**
     * Sets the `rel` attribute for the linkable card
     */
    rel?: string;
    /**
     * Sets the accessibility label for the card
     * This is useful when the card has an `href` or `onClick` prop
     * Setting this will announce the label when the card is focused
     */
    accessibilityLabel?: string;
    /**
     * If `true`, the card will scale up on hover
     *
     * On mobile devices it will scale down on press
     *
     * **This prop is deprecated in favour of motion presets released in v12**
     *
     * ### Migration
     *
     * ```diff
     * - <Card
     * -  shouldScaleOnHover
     * - />
     *
     * + <Scale motionTriggers={['hover']}>
     * +   <Card />
     * + </Scale>
     * ```
     *
     * @default false
     *
     * @deprecated This prop is deprecated in favour of motion presets released in v12
     */
    shouldScaleOnHover?: boolean;
    /**
     * Callback triggered when the card is hovered
     */
    onHover?: () => void;
    /**
     * Sets the size of the card header title
     *
     * @default 'large'
     */
    size?: 'large' | 'medium';
    /**
     * Callback triggered when the card is clicked
     */
    onClick?: (event: Platform.Select<{
        web: React.MouseEvent;
        native: GestureResponderEvent;
    }>) => void;
    /**
     * Sets the HTML element for the Card
     *
     * When `as` is set to `label`, the card will be rendered as a label element
     * This can be used to create a custom checkbox or radio button using the card
     *
     * @default undefined
     */
    as?: 'label';
} & TestID & DataAnalyticsAttribute & StyledPropsBlade;
type CardBodyProps = {
    children: React.ReactNode;
    height?: BoxProps['height'];
} & TestID & DataAnalyticsAttribute;
declare const Card: React.ForwardRefExoticComponent<{
    /**
     * Card contents
     */
    children: React.ReactNode;
    /**
     * Sets the background color of the Card
     *
     * @default `surface.background.gray.intense`
     */
    backgroundColor?: "surface.background.gray.subtle" | "surface.background.gray.intense" | "surface.background.gray.moderate" | undefined;
    /**
     * Sets the border radius of the Card
     *
     * @default `medium`
     */
    borderRadius?: "medium" | "large" | "xlarge" | undefined;
    /**
     * Sets the elevation for Cards
     *
     * eg: `theme.elevation.midRaised`
     *
     * @default `theme.elevation.lowRaised`
     *
     * **Links:**
     * - Docs: https://blade.razorpay.com/?path=/docs/tokens-elevation--docs
     */
    elevation?: import('../../tokens/global/elevation').ElevationLevels | undefined;
    /**
     * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
     * @default `spacing.7`
     *
     * **Links:**
     * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--docs
     */
    padding?: CardSpacingValueType | undefined;
    /**
     * Sets the width of the card
     */
    width?: BoxProps['width'];
    /**
     * Sets the height of the card
     */
    height?: BoxProps['height'];
    /**
     * Sets minimum height of the card
     */
    minHeight?: BoxProps['minHeight'];
    /**
     * Sets minimum width of the card
     */
    minWidth?: BoxProps['minWidth'];
    /**
     * Sets maximum width of the card
     */
    maxWidth?: BoxProps['maxWidth'];
    /**
     * If `true`, the card will be in selected state
     * Card will have a primary color border around it.
     *
     * @default false
     */
    isSelected?: boolean | undefined;
    /**
     * Makes the Card linkable by setting the `href` prop
     *
     * @default undefined
     */
    href?: string | undefined;
    /**
     * Sets the `target` attribute for the linkable card
     */
    target?: string | undefined;
    /**
     * Sets the `rel` attribute for the linkable card
     */
    rel?: string | undefined;
    /**
     * Sets the accessibility label for the card
     * This is useful when the card has an `href` or `onClick` prop
     * Setting this will announce the label when the card is focused
     */
    accessibilityLabel?: string | undefined;
    /**
     * If `true`, the card will scale up on hover
     *
     * On mobile devices it will scale down on press
     *
     * **This prop is deprecated in favour of motion presets released in v12**
     *
     * ### Migration
     *
     * ```diff
     * - <Card
     * -  shouldScaleOnHover
     * - />
     *
     * + <Scale motionTriggers={['hover']}>
     * +   <Card />
     * + </Scale>
     * ```
     *
     * @default false
     *
     * @deprecated This prop is deprecated in favour of motion presets released in v12
     */
    shouldScaleOnHover?: boolean | undefined;
    /**
     * Callback triggered when the card is hovered
     */
    onHover?: (() => void) | undefined;
    /**
     * Sets the size of the card header title
     *
     * @default 'large'
     */
    size?: "medium" | "large" | undefined;
    /**
     * Callback triggered when the card is clicked
     */
    onClick?: ((event: Platform.Select<{
        web: React.MouseEvent;
        native: GestureResponderEvent;
    }>) => void) | undefined;
    /**
     * Sets the HTML element for the Card
     *
     * When `as` is set to `label`, the card will be rendered as a label element
     * This can be used to create a custom checkbox or radio button using the card
     *
     * @default undefined
     */
    as?: "label" | undefined;
} & TestID & DataAnalyticsAttribute & Partial<Omit<import('../Box/BaseBox/types/spacingTypes').MarginProps & Pick<import('../Box/BaseBox/types/propsTypes').FlexboxProps, "alignSelf" | "flexWrap" | "justifySelf" | "order" | "placeSelf"> & {
    bottom: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    left: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    position?: import("csstype").Property.Position | {
        readonly base?: import("csstype").Property.Position | undefined;
        readonly xs?: import("csstype").Property.Position | undefined;
        readonly s?: import("csstype").Property.Position | undefined;
        readonly m?: import("csstype").Property.Position | undefined;
        readonly l?: import("csstype").Property.Position | undefined;
        readonly xl?: import("csstype").Property.Position | undefined;
    } | undefined;
    right: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    top: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    zIndex?: import("csstype").Property.ZIndex | {
        readonly base?: import("csstype").Property.ZIndex | undefined;
        readonly xs?: import("csstype").Property.ZIndex | undefined;
        readonly s?: import("csstype").Property.ZIndex | undefined;
        readonly m?: import("csstype").Property.ZIndex | undefined;
        readonly l?: import("csstype").Property.ZIndex | undefined;
        readonly xl?: import("csstype").Property.ZIndex | undefined;
    } | undefined;
    __brand__?: "platform-web" | {
        readonly base?: "platform-web" | undefined;
        readonly xs?: "platform-web" | undefined;
        readonly s?: "platform-web" | undefined;
        readonly m?: "platform-web" | undefined;
        readonly l?: "platform-web" | undefined;
        readonly xl?: "platform-web" | undefined;
    } | undefined;
} & Pick<{
    gridAutoColumns?: import("csstype").Property.GridAutoColumns<string | number> | {
        readonly base?: import("csstype").Property.GridAutoColumns<string | number> | undefined;
        readonly xs?: import("csstype").Property.GridAutoColumns<string | number> | undefined;
        readonly s?: import("csstype").Property.GridAutoColumns<string | number> | undefined;
        readonly m?: import("csstype").Property.GridAutoColumns<string | number> | undefined;
        readonly l?: import("csstype").Property.GridAutoColumns<string | number> | undefined;
        readonly xl?: import("csstype").Property.GridAutoColumns<string | number> | undefined;
    } | undefined;
    gridAutoFlow?: import("csstype").Property.GridAutoFlow | {
        readonly base?: import("csstype").Property.GridAutoFlow | undefined;
        readonly xs?: import("csstype").Property.GridAutoFlow | undefined;
        readonly s?: import("csstype").Property.GridAutoFlow | undefined;
        readonly m?: import("csstype").Property.GridAutoFlow | undefined;
        readonly l?: import("csstype").Property.GridAutoFlow | undefined;
        readonly xl?: import("csstype").Property.GridAutoFlow | undefined;
    } | undefined;
    gridAutoRows?: import("csstype").Property.GridAutoRows<string | number> | {
        readonly base?: import("csstype").Property.GridAutoRows<string | number> | undefined;
        readonly xs?: import("csstype").Property.GridAutoRows<string | number> | undefined;
        readonly s?: import("csstype").Property.GridAutoRows<string | number> | undefined;
        readonly m?: import("csstype").Property.GridAutoRows<string | number> | undefined;
        readonly l?: import("csstype").Property.GridAutoRows<string | number> | undefined;
        readonly xl?: import("csstype").Property.GridAutoRows<string | number> | undefined;
    } | undefined;
    gridColumnEnd?: import("csstype").Property.GridColumnEnd | {
        readonly base?: import("csstype").Property.GridColumnEnd | undefined;
        readonly xs?: import("csstype").Property.GridColumnEnd | undefined;
        readonly s?: import("csstype").Property.GridColumnEnd | undefined;
        readonly m?: import("csstype").Property.GridColumnEnd | undefined;
        readonly l?: import("csstype").Property.GridColumnEnd | undefined;
        readonly xl?: import("csstype").Property.GridColumnEnd | undefined;
    } | undefined;
    gridColumnStart?: import("csstype").Property.GridColumnStart | {
        readonly base?: import("csstype").Property.GridColumnStart | undefined;
        readonly xs?: import("csstype").Property.GridColumnStart | undefined;
        readonly s?: import("csstype").Property.GridColumnStart | undefined;
        readonly m?: import("csstype").Property.GridColumnStart | undefined;
        readonly l?: import("csstype").Property.GridColumnStart | undefined;
        readonly xl?: import("csstype").Property.GridColumnStart | undefined;
    } | undefined;
    gridRowEnd?: import("csstype").Property.GridRowEnd | {
        readonly base?: import("csstype").Property.GridRowEnd | undefined;
        readonly xs?: import("csstype").Property.GridRowEnd | undefined;
        readonly s?: import("csstype").Property.GridRowEnd | undefined;
        readonly m?: import("csstype").Property.GridRowEnd | undefined;
        readonly l?: import("csstype").Property.GridRowEnd | undefined;
        readonly xl?: import("csstype").Property.GridRowEnd | undefined;
    } | undefined;
    gridRowStart?: import("csstype").Property.GridRowStart | {
        readonly base?: import("csstype").Property.GridRowStart | undefined;
        readonly xs?: import("csstype").Property.GridRowStart | undefined;
        readonly s?: import("csstype").Property.GridRowStart | undefined;
        readonly m?: import("csstype").Property.GridRowStart | undefined;
        readonly l?: import("csstype").Property.GridRowStart | undefined;
        readonly xl?: import("csstype").Property.GridRowStart | undefined;
    } | undefined;
    gridTemplateAreas?: import("csstype").Property.GridTemplateAreas | {
        readonly base?: import("csstype").Property.GridTemplateAreas | undefined;
        readonly xs?: import("csstype").Property.GridTemplateAreas | undefined;
        readonly s?: import("csstype").Property.GridTemplateAreas | undefined;
        readonly m?: import("csstype").Property.GridTemplateAreas | undefined;
        readonly l?: import("csstype").Property.GridTemplateAreas | undefined;
        readonly xl?: import("csstype").Property.GridTemplateAreas | undefined;
    } | undefined;
    gridTemplateColumns?: import("csstype").Property.GridTemplateColumns<string | number> | {
        readonly base?: import("csstype").Property.GridTemplateColumns<string | number> | undefined;
        readonly xs?: import("csstype").Property.GridTemplateColumns<string | number> | undefined;
        readonly s?: import("csstype").Property.GridTemplateColumns<string | number> | undefined;
        readonly m?: import("csstype").Property.GridTemplateColumns<string | number> | undefined;
        readonly l?: import("csstype").Property.GridTemplateColumns<string | number> | undefined;
        readonly xl?: import("csstype").Property.GridTemplateColumns<string | number> | undefined;
    } | undefined;
    gridTemplateRows?: import("csstype").Property.GridTemplateRows<string | number> | {
        readonly base?: import("csstype").Property.GridTemplateRows<string | number> | undefined;
        readonly xs?: import("csstype").Property.GridTemplateRows<string | number> | undefined;
        readonly s?: import("csstype").Property.GridTemplateRows<string | number> | undefined;
        readonly m?: import("csstype").Property.GridTemplateRows<string | number> | undefined;
        readonly l?: import("csstype").Property.GridTemplateRows<string | number> | undefined;
        readonly xl?: import("csstype").Property.GridTemplateRows<string | number> | undefined;
    } | undefined;
    grid?: import("csstype").Property.Grid | {
        readonly base?: import("csstype").Property.Grid | undefined;
        readonly xs?: import("csstype").Property.Grid | undefined;
        readonly s?: import("csstype").Property.Grid | undefined;
        readonly m?: import("csstype").Property.Grid | undefined;
        readonly l?: import("csstype").Property.Grid | undefined;
        readonly xl?: import("csstype").Property.Grid | undefined;
    } | undefined;
    gridArea?: import("csstype").Property.GridArea | {
        readonly base?: import("csstype").Property.GridArea | undefined;
        readonly xs?: import("csstype").Property.GridArea | undefined;
        readonly s?: import("csstype").Property.GridArea | undefined;
        readonly m?: import("csstype").Property.GridArea | undefined;
        readonly l?: import("csstype").Property.GridArea | undefined;
        readonly xl?: import("csstype").Property.GridArea | undefined;
    } | undefined;
    gridColumn?: import("csstype").Property.GridColumn | {
        readonly base?: import("csstype").Property.GridColumn | undefined;
        readonly xs?: import("csstype").Property.GridColumn | undefined;
        readonly s?: import("csstype").Property.GridColumn | undefined;
        readonly m?: import("csstype").Property.GridColumn | undefined;
        readonly l?: import("csstype").Property.GridColumn | undefined;
        readonly xl?: import("csstype").Property.GridColumn | undefined;
    } | undefined;
    gridRow?: import("csstype").Property.GridRow | {
        readonly base?: import("csstype").Property.GridRow | undefined;
        readonly xs?: import("csstype").Property.GridRow | undefined;
        readonly s?: import("csstype").Property.GridRow | undefined;
        readonly m?: import("csstype").Property.GridRow | undefined;
        readonly l?: import("csstype").Property.GridRow | undefined;
        readonly xl?: import("csstype").Property.GridRow | undefined;
    } | undefined;
    gridTemplate?: import("csstype").Property.GridTemplate | {
        readonly base?: import("csstype").Property.GridTemplate | undefined;
        readonly xs?: import("csstype").Property.GridTemplate | undefined;
        readonly s?: import("csstype").Property.GridTemplate | undefined;
        readonly m?: import("csstype").Property.GridTemplate | undefined;
        readonly l?: import("csstype").Property.GridTemplate | undefined;
        readonly xl?: import("csstype").Property.GridTemplate | undefined;
    } | undefined;
    __brand__?: "platform-web" | {
        readonly base?: "platform-web" | undefined;
        readonly xs?: "platform-web" | undefined;
        readonly s?: "platform-web" | undefined;
        readonly m?: "platform-web" | undefined;
        readonly l?: "platform-web" | undefined;
        readonly xl?: "platform-web" | undefined;
    } | undefined;
}, "gridColumnEnd" | "gridColumnStart" | "gridRowEnd" | "gridRowStart" | "gridArea" | "gridColumn" | "gridRow"> & Pick<{
    width: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    display?: import("csstype").Property.Display | {
        readonly base?: import("csstype").Property.Display | undefined;
        readonly xs?: import("csstype").Property.Display | undefined;
        readonly s?: import("csstype").Property.Display | undefined;
        readonly m?: import("csstype").Property.Display | undefined;
        readonly l?: import("csstype").Property.Display | undefined;
        readonly xl?: import("csstype").Property.Display | undefined;
    } | undefined;
    height: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    maxHeight: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    maxWidth: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    minHeight: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    minWidth: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | {
        readonly base?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xs?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly s?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly m?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly l?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
        readonly xl?: import('../Box/BaseBox/types/spacingTypes').SpacingValueType | undefined;
    };
    overflowX?: import("csstype").Property.OverflowX | {
        readonly base?: import("csstype").Property.OverflowX | undefined;
        readonly xs?: import("csstype").Property.OverflowX | undefined;
        readonly s?: import("csstype").Property.OverflowX | undefined;
        readonly m?: import("csstype").Property.OverflowX | undefined;
        readonly l?: import("csstype").Property.OverflowX | undefined;
        readonly xl?: import("csstype").Property.OverflowX | undefined;
    } | undefined;
    overflowY?: import("csstype").Property.OverflowY | {
        readonly base?: import("csstype").Property.OverflowY | undefined;
        readonly xs?: import("csstype").Property.OverflowY | undefined;
        readonly s?: import("csstype").Property.OverflowY | undefined;
        readonly m?: import("csstype").Property.OverflowY | undefined;
        readonly l?: import("csstype").Property.OverflowY | undefined;
        readonly xl?: import("csstype").Property.OverflowY | undefined;
    } | undefined;
    textAlign?: import("csstype").Property.TextAlign | {
        readonly base?: import("csstype").Property.TextAlign | undefined;
        readonly xs?: import("csstype").Property.TextAlign | undefined;
        readonly s?: import("csstype").Property.TextAlign | undefined;
        readonly m?: import("csstype").Property.TextAlign | undefined;
        readonly l?: import("csstype").Property.TextAlign | undefined;
        readonly xl?: import("csstype").Property.TextAlign | undefined;
    } | undefined;
    whiteSpace?: import("csstype").Property.WhiteSpace | {
        readonly base?: import("csstype").Property.WhiteSpace | undefined;
        readonly xs?: import("csstype").Property.WhiteSpace | undefined;
        readonly s?: import("csstype").Property.WhiteSpace | undefined;
        readonly m?: import("csstype").Property.WhiteSpace | undefined;
        readonly l?: import("csstype").Property.WhiteSpace | undefined;
        readonly xl?: import("csstype").Property.WhiteSpace | undefined;
    } | undefined;
    overflow?: import("csstype").Property.Overflow | {
        readonly base?: import("csstype").Property.Overflow | undefined;
        readonly xs?: import("csstype").Property.Overflow | undefined;
        readonly s?: import("csstype").Property.Overflow | undefined;
        readonly m?: import("csstype").Property.Overflow | undefined;
        readonly l?: import("csstype").Property.Overflow | undefined;
        readonly xl?: import("csstype").Property.Overflow | undefined;
    } | undefined;
    __brand__?: "platform-web" | {
        readonly base?: "platform-web" | undefined;
        readonly xs?: "platform-web" | undefined;
        readonly s?: "platform-web" | undefined;
        readonly m?: "platform-web" | undefined;
        readonly l?: "platform-web" | undefined;
        readonly xl?: "platform-web" | undefined;
    } | undefined;
}, "display"> & Pick<{
    backgroundImage?: import("csstype").Property.BackgroundImage | {
        readonly base?: import("csstype").Property.BackgroundImage | undefined;
        readonly xs?: import("csstype").Property.BackgroundImage | undefined;
        readonly s?: import("csstype").Property.BackgroundImage | undefined;
        readonly m?: import("csstype").Property.BackgroundImage | undefined;
        readonly l?: import("csstype").Property.BackgroundImage | undefined;
        readonly xl?: import("csstype").Property.BackgroundImage | undefined;
    } | undefined;
    backgroundOrigin?: import("csstype").Property.BackgroundOrigin | {
        readonly base?: import("csstype").Property.BackgroundOrigin | undefined;
        readonly xs?: import("csstype").Property.BackgroundOrigin | undefined;
        readonly s?: import("csstype").Property.BackgroundOrigin | undefined;
        readonly m?: import("csstype").Property.BackgroundOrigin | undefined;
        readonly l?: import("csstype").Property.BackgroundOrigin | undefined;
        readonly xl?: import("csstype").Property.BackgroundOrigin | undefined;
    } | undefined;
    backgroundRepeat?: import("csstype").Property.BackgroundRepeat | {
        readonly base?: import("csstype").Property.BackgroundRepeat | undefined;
        readonly xs?: import("csstype").Property.BackgroundRepeat | undefined;
        readonly s?: import("csstype").Property.BackgroundRepeat | undefined;
        readonly m?: import("csstype").Property.BackgroundRepeat | undefined;
        readonly l?: import("csstype").Property.BackgroundRepeat | undefined;
        readonly xl?: import("csstype").Property.BackgroundRepeat | undefined;
    } | undefined;
    backgroundSize?: import("csstype").Property.BackgroundSize<string | number> | {
        readonly base?: import("csstype").Property.BackgroundSize<string | number> | undefined;
        readonly xs?: import("csstype").Property.BackgroundSize<string | number> | undefined;
        readonly s?: import("csstype").Property.BackgroundSize<string | number> | undefined;
        readonly m?: import("csstype").Property.BackgroundSize<string | number> | undefined;
        readonly l?: import("csstype").Property.BackgroundSize<string | number> | undefined;
        readonly xl?: import("csstype").Property.BackgroundSize<string | number> | undefined;
    } | undefined;
    borderBottomColor: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | {
        readonly base?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xs?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly s?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly m?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly l?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xl?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
    };
    borderBottomLeftRadius: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | {
        readonly base?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xs?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly s?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly m?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly l?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xl?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
    };
    borderBottomRightRadius: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | {
        readonly base?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xs?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly s?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly m?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly l?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xl?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
    };
    borderBottomStyle?: import("csstype").Property.BorderBottomStyle | {
        readonly base?: import("csstype").Property.BorderBottomStyle | undefined;
        readonly xs?: import("csstype").Property.BorderBottomStyle | undefined;
        readonly s?: import("csstype").Property.BorderBottomStyle | undefined;
        readonly m?: import("csstype").Property.BorderBottomStyle | undefined;
        readonly l?: import("csstype").Property.BorderBottomStyle | undefined;
        readonly xl?: import("csstype").Property.BorderBottomStyle | undefined;
    } | undefined;
    borderBottomWidth: "none" | "thinner" | "thin" | "thick" | "thicker" | {
        readonly base?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xs?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly s?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly m?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly l?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xl?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
    };
    borderLeftColor: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | {
        readonly base?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xs?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly s?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly m?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly l?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xl?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
    };
    borderLeftStyle?: import("csstype").Property.BorderLeftStyle | {
        readonly base?: import("csstype").Property.BorderLeftStyle | undefined;
        readonly xs?: import("csstype").Property.BorderLeftStyle | undefined;
        readonly s?: import("csstype").Property.BorderLeftStyle | undefined;
        readonly m?: import("csstype").Property.BorderLeftStyle | undefined;
        readonly l?: import("csstype").Property.BorderLeftStyle | undefined;
        readonly xl?: import("csstype").Property.BorderLeftStyle | undefined;
    } | undefined;
    borderLeftWidth: "none" | "thinner" | "thin" | "thick" | "thicker" | {
        readonly base?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xs?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly s?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly m?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly l?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xl?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
    };
    borderRightColor: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | {
        readonly base?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xs?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly s?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly m?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly l?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xl?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
    };
    borderRightStyle?: import("csstype").Property.BorderRightStyle | {
        readonly base?: import("csstype").Property.BorderRightStyle | undefined;
        readonly xs?: import("csstype").Property.BorderRightStyle | undefined;
        readonly s?: import("csstype").Property.BorderRightStyle | undefined;
        readonly m?: import("csstype").Property.BorderRightStyle | undefined;
        readonly l?: import("csstype").Property.BorderRightStyle | undefined;
        readonly xl?: import("csstype").Property.BorderRightStyle | undefined;
    } | undefined;
    borderRightWidth: "none" | "thinner" | "thin" | "thick" | "thicker" | {
        readonly base?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xs?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly s?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly m?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly l?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xl?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
    };
    borderTopColor: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | {
        readonly base?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xs?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly s?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly m?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly l?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xl?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
    };
    borderTopLeftRadius: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | {
        readonly base?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xs?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly s?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly m?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly l?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xl?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
    };
    borderTopRightRadius: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | {
        readonly base?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xs?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly s?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly m?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly l?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xl?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
    };
    borderTopStyle?: import("csstype").Property.BorderTopStyle | {
        readonly base?: import("csstype").Property.BorderTopStyle | undefined;
        readonly xs?: import("csstype").Property.BorderTopStyle | undefined;
        readonly s?: import("csstype").Property.BorderTopStyle | undefined;
        readonly m?: import("csstype").Property.BorderTopStyle | undefined;
        readonly l?: import("csstype").Property.BorderTopStyle | undefined;
        readonly xl?: import("csstype").Property.BorderTopStyle | undefined;
    } | undefined;
    borderTopWidth: "none" | "thinner" | "thin" | "thick" | "thicker" | {
        readonly base?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xs?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly s?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly m?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly l?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xl?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
    };
    clipPath?: import("csstype").Property.ClipPath | {
        readonly base?: import("csstype").Property.ClipPath | undefined;
        readonly xs?: import("csstype").Property.ClipPath | undefined;
        readonly s?: import("csstype").Property.ClipPath | undefined;
        readonly m?: import("csstype").Property.ClipPath | undefined;
        readonly l?: import("csstype").Property.ClipPath | undefined;
        readonly xl?: import("csstype").Property.ClipPath | undefined;
    } | undefined;
    opacity?: import("csstype").Property.Opacity | {
        readonly base?: import("csstype").Property.Opacity | undefined;
        readonly xs?: import("csstype").Property.Opacity | undefined;
        readonly s?: import("csstype").Property.Opacity | undefined;
        readonly m?: import("csstype").Property.Opacity | undefined;
        readonly l?: import("csstype").Property.Opacity | undefined;
        readonly xl?: import("csstype").Property.Opacity | undefined;
    } | undefined;
    pointerEvents?: import("csstype").Property.PointerEvents | {
        readonly base?: import("csstype").Property.PointerEvents | undefined;
        readonly xs?: import("csstype").Property.PointerEvents | undefined;
        readonly s?: import("csstype").Property.PointerEvents | undefined;
        readonly m?: import("csstype").Property.PointerEvents | undefined;
        readonly l?: import("csstype").Property.PointerEvents | undefined;
        readonly xl?: import("csstype").Property.PointerEvents | undefined;
    } | undefined;
    transform?: import("csstype").Property.Transform | {
        readonly base?: import("csstype").Property.Transform | undefined;
        readonly xs?: import("csstype").Property.Transform | undefined;
        readonly s?: import("csstype").Property.Transform | undefined;
        readonly m?: import("csstype").Property.Transform | undefined;
        readonly l?: import("csstype").Property.Transform | undefined;
        readonly xl?: import("csstype").Property.Transform | undefined;
    } | undefined;
    transformOrigin?: import("csstype").Property.TransformOrigin<string | number> | {
        readonly base?: import("csstype").Property.TransformOrigin<string | number> | undefined;
        readonly xs?: import("csstype").Property.TransformOrigin<string | number> | undefined;
        readonly s?: import("csstype").Property.TransformOrigin<string | number> | undefined;
        readonly m?: import("csstype").Property.TransformOrigin<string | number> | undefined;
        readonly l?: import("csstype").Property.TransformOrigin<string | number> | undefined;
        readonly xl?: import("csstype").Property.TransformOrigin<string | number> | undefined;
    } | undefined;
    visibility?: import("csstype").Property.Visibility | {
        readonly base?: import("csstype").Property.Visibility | undefined;
        readonly xs?: import("csstype").Property.Visibility | undefined;
        readonly s?: import("csstype").Property.Visibility | undefined;
        readonly m?: import("csstype").Property.Visibility | undefined;
        readonly l?: import("csstype").Property.Visibility | undefined;
        readonly xl?: import("csstype").Property.Visibility | undefined;
    } | undefined;
    backgroundPosition?: import("csstype").Property.BackgroundPosition<string | number> | {
        readonly base?: import("csstype").Property.BackgroundPosition<string | number> | undefined;
        readonly xs?: import("csstype").Property.BackgroundPosition<string | number> | undefined;
        readonly s?: import("csstype").Property.BackgroundPosition<string | number> | undefined;
        readonly m?: import("csstype").Property.BackgroundPosition<string | number> | undefined;
        readonly l?: import("csstype").Property.BackgroundPosition<string | number> | undefined;
        readonly xl?: import("csstype").Property.BackgroundPosition<string | number> | undefined;
    } | undefined;
    borderColor: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | {
        readonly base?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xs?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly s?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly m?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly l?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
        readonly xl?: "surface.border.gray.subtle" | "surface.border.gray.normal" | "surface.border.gray.muted" | "surface.border.primary.normal" | "surface.border.primary.muted" | undefined;
    };
    borderRadius: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | {
        readonly base?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xs?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly s?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly m?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly l?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
        readonly xl?: "none" | "xsmall" | "small" | "medium" | "large" | "xlarge" | "2xlarge" | "max" | "round" | undefined;
    };
    borderStyle?: import("csstype").Property.BorderStyle | {
        readonly base?: import("csstype").Property.BorderStyle | undefined;
        readonly xs?: import("csstype").Property.BorderStyle | undefined;
        readonly s?: import("csstype").Property.BorderStyle | undefined;
        readonly m?: import("csstype").Property.BorderStyle | undefined;
        readonly l?: import("csstype").Property.BorderStyle | undefined;
        readonly xl?: import("csstype").Property.BorderStyle | undefined;
    } | undefined;
    borderWidth: "none" | "thinner" | "thin" | "thick" | "thicker" | {
        readonly base?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xs?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly s?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly m?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly l?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
        readonly xl?: "none" | "thinner" | "thin" | "thick" | "thicker" | undefined;
    };
    elevation?: import('../../tokens/global/elevation').ElevationLevels | {
        readonly base?: import('../../tokens/global/elevation').ElevationLevels | undefined;
        readonly xs?: import('../../tokens/global/elevation').ElevationLevels | undefined;
        readonly s?: import('../../tokens/global/elevation').ElevationLevels | undefined;
        readonly m?: import('../../tokens/global/elevation').ElevationLevels | undefined;
        readonly l?: import('../../tokens/global/elevation').ElevationLevels | undefined;
        readonly xl?: import('../../tokens/global/elevation').ElevationLevels | undefined;
    } | undefined;
    __brand__?: "platform-web" | {
        readonly base?: "platform-web" | undefined;
        readonly xs?: "platform-web" | undefined;
        readonly s?: "platform-web" | undefined;
        readonly m?: "platform-web" | undefined;
        readonly l?: "platform-web" | undefined;
        readonly xl?: "platform-web" | undefined;
    } | undefined;
}, "visibility">, "__brand__">> & React.RefAttributes<BladeElementRef>>;
declare const CardBody: ({ height, children, testID, ...rest }: CardBodyProps) => React.ReactElement;
export { Card, CardBody };
