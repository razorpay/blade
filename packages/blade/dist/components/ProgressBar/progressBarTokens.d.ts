import { CircularProgressBarFilledProps } from './types';
declare const indeterminateAnimation: {
    scaleXInitial: number;
    scaleXMid: number;
    scaleXFinal: number;
    leftInitial: string;
    leftMid: string;
    leftFinal: string;
    fillWidth: string;
};
declare const pulseAnimation: {
    opacityInitial: number;
    opacityMid: number;
    opacityFinal: number;
    backgroundColor: string;
};
declare const circularProgressSizeTokens: {
    readonly small: {
        readonly size: 24;
        readonly strokeWidth: 3;
        readonly percentTextSize: "small";
    };
    readonly medium: {
        readonly size: 48;
        readonly strokeWidth: 5;
        readonly percentTextSize: "small";
    };
    readonly large: {
        readonly size: 72;
        readonly strokeWidth: 7;
        readonly percentTextSize: "medium";
    };
};
declare const getCircularProgressSVGTokens: ({ size, progressPercent, }: {
    size: NonNullable<CircularProgressBarFilledProps['size']>;
    progressPercent: number;
}) => {
    sqSize: number;
    strokeWidth: number;
    radius: number;
    viewBox: string;
    dashArray: number;
    dashOffset: number;
};
export { indeterminateAnimation, pulseAnimation, circularProgressSizeTokens, getCircularProgressSVGTokens, };
