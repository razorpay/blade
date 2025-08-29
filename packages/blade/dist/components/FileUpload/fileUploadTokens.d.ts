import { BladeFile, FileUploadItemBackgroundColors } from './types';
import { SelectorInputHoverTokens } from '../Form/Selector/types';
import { DurationString, EasingString } from '../../tokens/global';
declare const getFileUploadInputHoverTokens: () => SelectorInputHoverTokens;
declare const fileUploadMotionTokens: Record<'duration' | 'easing', DurationString | EasingString>;
declare const fileUploadHeightTokens: {
    medium: 56;
    large: 64;
};
declare const fileUploadColorTokens: {
    readonly text: {
        readonly default: "surface.text.gray.subtle";
        readonly disabled: "surface.text.gray.disabled";
    };
    readonly border: {
        readonly default: "interactive.border.gray.default";
        readonly disabled: "interactive.border.gray.disabled";
    };
    readonly background: {
        readonly hover: "interactive.background.gray.highlighted";
        readonly active: "interactive.background.primary.faded";
    };
    readonly icon: {
        readonly default: "interactive.icon.primary.subtle";
        readonly disabled: "interactive.icon.primary.disabled";
    };
    readonly link: {
        readonly default: "interactive.text.primary.subtle";
        readonly disabled: "interactive.text.primary.disabled";
    };
};
declare const fileUploadItemBackgroundColors: Record<NonNullable<BladeFile['status']>, Record<'default' | 'hover', FileUploadItemBackgroundColors>>;
declare const fileUploadLinkBorderTokens: {
    readonly color: {
        readonly default: "surface.border.primary.normal";
        readonly disabled: "surface.border.primary.muted";
    };
    readonly width: {
        readonly default: "thin";
    };
};
export { getFileUploadInputHoverTokens, fileUploadMotionTokens, fileUploadItemBackgroundColors, fileUploadColorTokens, fileUploadLinkBorderTokens, fileUploadHeightTokens, };
