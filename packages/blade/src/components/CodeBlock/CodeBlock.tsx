import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getPlatformType } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef, TestID } from '~utils/types';
import { makeSpace } from '~utils/makeSpace';
import { SupportedLanguages, formatters as codeFormatters } from './formatters';

type CodeBlockProps = {
    /**
     * The code content to display and highlight
     */
    children: string;
    /**
     * The language for syntax highlighting
     * Currently supports "json" and "protobuf"
     *
     * @default 'json'
     */
    lang?: SupportedLanguages;
    /**
     * Whether to show a background color
     *
     * @default true
     */
    showBackground?: boolean;
    /**
     * Whether to show line numbers
     * 
     * @default true
     */
    showLineNumbers?: boolean;
} & TestID &
    StyledPropsBlade;

type CodeBlockContainerProps = {
    showBackground: boolean;
};

const CodeBlockContainer = styled(BaseBox)<CodeBlockContainerProps>((props) => {
    return {
        // No padding here - the CodePre component already has padding
        backgroundColor: undefined, // Background handled by CodePre
        borderRadius: props.theme.border.radius.medium,
        overflowX: 'auto',
    };
});

const _CodeBlock = ({
    children,
    lang = 'json',
    testID,
    showBackground = true,
    showLineNumbers = true,
    ...rest
}: CodeBlockProps) => {
    // Get the formatter for the specified language
    const formatter = codeFormatters[lang] || codeFormatters.json;

    // Format the code using the formatters from the formatters directory
    const formattedCode = formatter.format(children, showBackground, showLineNumbers);

    return (
        <CodeBlockContainer
            showBackground={showBackground}
            {...metaAttribute({ name: MetaConstants.CodeBlock, testID })}
            {...getStyledProps(rest)}
        >
            {formattedCode}
        </CodeBlockContainer>
    );
};

/**
 * CodeBlock displays code with syntax highlighting.
 * Currently supports JSON and Protobuf languages.
 */
const CodeBlock = React.forwardRef<BladeElementRef, CodeBlockProps>(
    (props, ref) => <_CodeBlock {...props} />
);

CodeBlock.displayName = 'CodeBlock';

export { _CodeBlock, CodeBlock };
export type { CodeBlockProps }; 