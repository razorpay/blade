import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef, TestID } from '~utils/types';
// Remove formatters import and define type directly here
// import { SupportedLanguages } from './formatters';

/**
 * Supported language types for syntax highlighting
 * 
 * When adding a new language:
 * 1. Add it to this type
 * 2. Import the corresponding Prism language below
 *    Example: import 'prismjs/components/prism-typescript';
 */
export type SupportedLanguages = 'json' | 'protobuf' | 'javascript';

// Import Prism for both test and non-test environments
import Prism from 'prismjs';

// Only import Prism modules in non-test environments
// This helps prevent Jest test failures
if (process.env.NODE_ENV !== 'test') {
    // Core styles
    require('prismjs/themes/prism.css');
    // Languages
    require('prismjs/components/prism-json');
    require('prismjs/components/prism-protobuf');
    require('prismjs/components/prism-javascript');
    // Plugins
    require('prismjs/plugins/line-numbers/prism-line-numbers');
    require('prismjs/plugins/line-numbers/prism-line-numbers.css');
}

type CodeBlockProps = {
    /**
     * The code content to display and highlight
     */
    children: string;
    /**
     * The language for syntax highlighting
     * Currently supports "json", "protobuf", and "javascript"
     * To add more languages, import the corresponding Prism language module
     * and update the SupportedLanguages type
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
        // No padding here - the PrismContainer component handles padding
        backgroundColor: undefined, // Background handled by PrismContainer
        borderRadius: props.theme.border.radius.medium,
        overflowX: 'auto',
    };
});

/**
 * Get theme colors for syntax highlighting based on Blade's theme
 */
const getThemeColors = (theme: any) => {
    const isDarkTheme = theme.colorScheme === 'dark';

    return {
        // GitHub-like colors for light/dark themes
        propertyName: isDarkTheme ? '#75beff' : '#0550ae',      // Blue
        stringValue: isDarkTheme ? '#a5d6ff' : '#0a3069',       // Dark blue
        numberValue: isDarkTheme ? '#75beff' : '#0550ae',       // Blue
        keywordValue: isDarkTheme ? '#ff7b72' : '#cf222e',      // Red
        commentValue: isDarkTheme ? '#8b949e' : '#6e7781',      // Gray
        typeValue: isDarkTheme ? '#ffa657' : '#953800',         // Brown
        background: isDarkTheme ? '#0d1117' : '#ffffff',        // Pure white for light theme
        text: isDarkTheme ? '#c9d1d9' : '#24292f',              // Text
        border: isDarkTheme ? '#30363d' : '#d0d7de',            // Border
        lineNumberColor: isDarkTheme ? '#6e7681' : '#6e7781',   // Line number color
    };
};

// Styled container that overrides Prism's default styling to match Blade and GitHub styles
const PrismContainer = styled.div<{ showBackground?: boolean, showLineNumbers?: boolean }>`
    ${({ theme, showBackground = true, showLineNumbers = true }) => {
        const colors = getThemeColors(theme);

        return css`
            margin: 0;
            border-radius: 6px;
            overflow: hidden;
            
            /* Override Prism's default styling */
            pre[class*="language-"] {
                margin: 0;
                padding: 1rem;
                background-color: ${showBackground ? colors.background : 'transparent'};
                color: ${colors.text};
                font-family: ${theme.typography.fonts.family.code};
                font-size: 0.875rem;
                line-height: 1.5;
                text-shadow: none;
                border: ${showBackground ? `1px solid ${colors.border}` : 'none'};
                
                /* Fix Prism's default styles that we don't want */
                -webkit-hyphens: none;
                -moz-hyphens: none;
                -ms-hyphens: none;
                hyphens: none;
                tab-size: 2;
                white-space: pre-wrap;
                word-break: normal;
                word-spacing: normal;
                word-wrap: normal;
            }
            
            /* Style the line numbers if enabled */
            ${showLineNumbers ? `
                pre.line-numbers {
                    padding-left: 3.8rem;
                    counter-reset: linenumber;
                }
                
                .line-numbers .line-numbers-rows {
                    border-right: 1px solid ${colors.border};
                    opacity: 0.5;
                }
                
                .line-numbers-rows > span:before {
                    color: ${colors.lineNumberColor};
                    padding-right: 0.8rem;
                }
            ` : ''}
            
            /* Token styling to match GitHub theme */
            
            /* Comments */
            .token.comment,
            .token.prolog,
            .token.doctype,
            .token.cdata {
                color: ${colors.commentValue};
                font-style: italic;
            }
            
            /* Punctuation */
            .token.punctuation {
                color: ${colors.text};
            }
            
            /* Namespaces */
            .token.namespace {
                opacity: 0.7;
            }
            
            /* Property, tag, boolean, number */
            .token.property,
            .token.tag,
            .token.boolean,
            .token.number,
            .token.constant,
            .token.symbol,
            .token.deleted {
                color: ${colors.numberValue};
            }
            
            /* String and char */
            .token.string,
            .token.char,
            .token.attr-value,
            .token.builtin,
            .token.inserted {
                color: ${colors.stringValue};
            }
            
            /* Operators, entity, URL */
            .token.operator,
            .token.entity,
            .token.url,
            .language-css .token.string,
            .style .token.string {
                color: ${colors.text};
                background: transparent;
            }
            
            /* Keywords */
            .token.atrule,
            .token.attr-name,
            .token.keyword {
                color: ${colors.keywordValue};
                font-weight: bold;
            }
            
            /* Functions, classes */
            .token.function,
            .token.class-name {
                color: ${colors.propertyName};
            }
            
            /* Regex, important */
            .token.regex,
            .token.important,
            .token.variable {
                color: ${colors.typeValue};
            }
            
            /* Important, bold, italic */
            .token.important,
            .token.bold {
                font-weight: bold;
            }
            
            .token.italic {
                font-style: italic;
            }
        `;
    }}
`;

const _CodeBlock = ({
    children,
    lang = 'json',
    testID,
    showBackground = true,
    showLineNumbers = true,
    ...rest
}: CodeBlockProps) => {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Highlight the code when the component mounts or when props change
        if (codeRef.current) {
            // Apply Prism highlighting
            Prism.highlightElement(codeRef.current);
        }
    }, [children, lang, showLineNumbers]);

    return (
        <CodeBlockContainer
            showBackground={showBackground}
            {...metaAttribute({ name: MetaConstants.CodeBlock, testID })}
            {...getStyledProps(rest)}
        >
            <PrismContainer
                showBackground={showBackground}
                showLineNumbers={showLineNumbers}
            >
                <pre className={showLineNumbers ? 'line-numbers' : ''}>
                    <code
                        ref={codeRef}
                        className={`language-${lang}`}
                    >
                        {children}
                    </code>
                </pre>
            </PrismContainer>
        </CodeBlockContainer>
    );
};

/**
 * CodeBlock displays code with syntax highlighting.
 * Uses Prism.js for syntax highlighting with GitHub-like styling.
 * Features automatic theme adaptation (light/dark) and optional line numbers.
 */
const CodeBlock = React.forwardRef<BladeElementRef, CodeBlockProps>(
    (props, ref) => <_CodeBlock {...props} />
);

CodeBlock.displayName = 'CodeBlock';

export { _CodeBlock, CodeBlock };
export type { CodeBlockProps }; 