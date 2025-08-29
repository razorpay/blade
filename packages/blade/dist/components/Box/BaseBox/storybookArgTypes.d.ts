import { BaseBoxProps, BoxProps, StyledPropsBlade } from './types';
type StorybookArgTypes<T> = {
    [P in keyof T]: {
        table?: {
            category?: 'StyledProps' | 'CommonEvents' | null;
            disable?: boolean;
        };
        control?: {
            type: string;
            options?: readonly string[];
        };
        description?: string;
    };
};
declare const getStyledPropsArgTypes: ({ category, descriptionLength, }?: {
    category?: "StyledProps" | null | undefined;
    descriptionLength?: "long" | undefined;
}) => StorybookArgTypes<StyledPropsBlade>;
declare const getBoxArgTypes: () => StorybookArgTypes<BoxProps>;
declare const getBaseBoxArgTypes: () => StorybookArgTypes<BaseBoxProps & {
    forwardedAs: string;
    ref: unknown;
    theme: unknown;
    as: string;
}>;
declare const getBladeCommonEventArgTypes: () => StorybookArgTypes<Record<string, string>>;
export { getBaseBoxArgTypes, getBoxArgTypes, getStyledPropsArgTypes, getBladeCommonEventArgTypes };
