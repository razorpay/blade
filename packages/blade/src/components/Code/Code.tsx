import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import styled from 'styled-components';
import { Box } from '../Box';
import { BaseText } from '../Typography/BaseText';
import type { CodeProps } from './types';
import { languageRegistry } from './languages/registry';

// Load Prism CSS
import 'prismjs/themes/prism.css';

/**
 * Container for the code block
 */
const CodeContainer = styled(Box) <{
    $showLineNumbers?: boolean;
    $isHighlighted: boolean;
}>`
  position: relative;
  overflow: auto;
  border-radius: ${({ theme }) => theme.border.radius.medium};
  background-color: ${({ theme, $isHighlighted }) =>
        $isHighlighted ? theme.colors.surface.background.gray.subtle : 'transparent'};
  padding: ${({ theme }) => theme.spacing[3]};
  
  ${({ $showLineNumbers, theme }) =>
        $showLineNumbers &&
        `
    counter-reset: line;
    
    .line {
      position: relative;
      padding-left: 3.5em;
      
      &:before {
        content: counter(line);
        counter-increment: line;
        position: absolute;
        left: 0;
        color: ${theme.colors.surface.text.gray.subtle};
        text-align: right;
        width: 3em;
        padding-right: 0.5em;
        user-select: none;
      }
    }
  `}

  /* Ensure proper whitespace preservation */
  code {
    display: block;
    white-space: pre;
    tab-size: 2;
    font-family: monospace;
  }
`;

/**
 * Code component with syntax highlighting
 */
export const Code: React.FC<CodeProps> = ({
    children,
    language = 'text',
    lang,
    showLineNumbers = false,
    size = 'small',
    weight = 'regular',
    isHighlighted = true,
    theme: syntaxTheme = 'default',
    color,
    testID,
    ...rest
}) => {
    // Use lang prop if provided, otherwise use language prop
    const languageToUse = lang || language;

    const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState<string>('');

    // Determine fontSize and lineHeight based on size
    const getFontSize = () => {
        switch (size) {
            case 'small':
                return 75;
            case 'medium':
                return 100;
            default:
                return 75;
        }
    };

    const getLineHeight = () => {
        switch (size) {
            case 'small':
                return 75;
            case 'medium':
                return 100;
            default:
                return 75;
        }
    };

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                if (languageRegistry.isSupported(languageToUse)) {
                    await languageRegistry.loadLanguage(languageToUse);
                    setIsLanguageLoaded(true);
                } else {
                    console.warn(`Language '${languageToUse}' is not supported, falling back to plain text`);
                    setIsLanguageLoaded(true);
                }
            } catch (error) {
                console.error(`Error loading language '${languageToUse}':`, error);
                setIsLanguageLoaded(true);
            }
        };

        loadLanguage();
    }, [languageToUse]);

    useEffect(() => {
        if (isLanguageLoaded) {
            const code = children.trim();

            // Apply syntax highlighting
            const grammar = Prism.languages[languageToUse] || Prism.languages.text;
            const highlighted = Prism.highlight(code, grammar, languageToUse);

            // Add line numbers if needed
            if (showLineNumbers) {
                const lines = highlighted.split('\n');
                const numberedLines = lines.map(line => `<span class="line">${line}</span>`).join('\n');
                setHighlightedCode(numberedLines);
            } else {
                setHighlightedCode(highlighted);
            }
        }
    }, [children, languageToUse, showLineNumbers, isLanguageLoaded]);

    return (
        <CodeContainer
            $showLineNumbers={showLineNumbers}
            $isHighlighted={isHighlighted}
            data-testid={testID}
            {...rest}
        >
            <BaseText
                as="code"
                fontSize={getFontSize()}
                lineHeight={getLineHeight()}
                fontWeight={weight}
                fontFamily="code"
                color={!isHighlighted && color ? color : undefined}
                margin="spacing.0"
                style={{ whiteSpace: 'pre', display: 'block' }}
            >
                <div
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
            </BaseText>
        </CodeContainer>
    );
};

export default Code; 