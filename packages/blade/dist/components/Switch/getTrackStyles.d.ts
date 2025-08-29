import { CSSObject } from 'styled-components';
import { TrackProps } from './types';
import { Theme } from '../BladeProvider';
declare const getTrackStyles: ({ isChecked, isDisabled, deviceType, size, theme, }: Required<Pick<import('./types').SwitchProps, "size" | "isDisabled" | "isChecked">> & {
    deviceType: "desktop" | "mobile";
} & {
    theme: Theme;
}) => CSSObject;
export { getTrackStyles };
