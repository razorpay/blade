import { StepGroupProps } from './types';
declare const markerLineDotWidth: 2;
declare const markerLineDotSpacing: 4;
declare const markerLineWidth: 2;
declare const itemTopMargin: 6;
/**
 * Returns the tokens that are related to marker line alignment and spacing
 */
declare const getMarkerLineSpacings: (size: NonNullable<StepGroupProps['size']>) => {
    markerLeftAlignment: number;
    markerTopAlignment: number;
    markerBackgroundSize: number;
    markerMargin: number;
    indentationWidth: number;
};
declare const stepItemHeaderTokens: {
    readonly medium: {
        readonly title: "medium";
        readonly description: "small";
        readonly timestamp: "small";
    };
    readonly large: {
        readonly title: "large";
        readonly description: "medium";
        readonly timestamp: "medium";
    };
};
declare const iconSizeTokens: {
    readonly medium: "small";
    readonly large: "medium";
};
declare const itemLineGap: {
    readonly medium: "spacing.2";
    readonly large: "spacing.3";
};
export { getMarkerLineSpacings, stepItemHeaderTokens, iconSizeTokens, itemLineGap, markerLineDotWidth, markerLineDotSpacing, markerLineWidth, itemTopMargin, };
