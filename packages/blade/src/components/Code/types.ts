import type { BaseTextProps, BaseTextSizes } from '../Typography/BaseText/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';

/**
 * Common props for Code component
 */
export type CodeCommonProps = {
    /**
     * The code to be highlighted
     */
    children: string;

    /**
     * The programming language of the code
     * @default 'text'
     */
    language?: string;

    /**
     * Alternative prop name for language (for better DX)
     * @default 'text'
     */
    lang?: string;

    /**
     * Whether to show line numbers
     * @default false
     */
    showLineNumbers?: boolean;

    /**
     * The size of the code block
     * @default 'small'
     */
    size?: Extract<BaseTextSizes, 'small' | 'medium'>;

    /**
     * Font weight for the code
     * @default 'regular'
     */
    weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'bold'>;

    /**
     * Whether to highlight the entire code block with a background
     * @default true
     */
    isHighlighted?: boolean;

    /**
     * Custom theme for syntax highlighting
     * @default 'default'
     */
    theme?: 'default' | 'dark' | string;

    /**
     * Color of the text when isHighlighted is false
     */
    color?: BaseTextProps['color'];
} & TestID & StyledPropsBlade;

/**
 * Props for Code with highlighting enabled
 */
export type CodeHighlightedProps = CodeCommonProps & {
    /**
     * Whether to highlight the entire code block with a background
     * @default true
     */
    isHighlighted?: true;

    /**
     * Color prop can only be added when isHighlighted is set to false
     */
    color?: undefined;
};

/**
 * Props for Code with highlighting disabled
 */
export type CodeNonHighlightedProps = CodeCommonProps & {
    /**
     * Whether to highlight the entire code block with a background
     */
    isHighlighted: false;

    /**
     * Color of the text when isHighlighted is false
     */
    color?: BaseTextProps['color'];
};

/**
 * Props for Code component
 */
export type CodeProps =
    | CodeHighlightedProps
    | CodeNonHighlightedProps; 