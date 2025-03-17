import React from 'react';
import styled, { css } from 'styled-components';

/**
 * Supported language types for syntax highlighting
 */
export type SupportedLanguages = 'json' | 'protobuf';

/**
 * Interface for language formatters
 */
export interface LanguageFormatter {
    /**
     * Format the provided code string with syntax highlighting
     * @param code The code string to format
     * @returns React nodes with syntax highlighting
     */
    format: (code: string) => React.ReactNode;
}

// Define types for matched parts to ensure type safety
interface MatchedPart {
    index: number;
    element: React.ReactElement;
    length?: number;
}

/**
 * Theme-aware GitHub-like syntax highlighting colors
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
        background: isDarkTheme ? '#0d1117' : '#f6f8fa',        // GitHub bg color
        text: isDarkTheme ? '#c9d1d9' : '#24292f',              // Text
        border: isDarkTheme ? '#30363d' : '#d0d7de',            // Border
        lineNumberColor: isDarkTheme ? '#6e7681' : '#6e7781',   // Line number color
    };
};

/**
 * Styled components for syntax highlighting
 * These components use GitHub-like colors for syntax highlighting that adapt to light/dark themes
 */

// Property names and keys for JSON
export const PropertyName = styled.span`
  ${({ theme }) => {
        const colors = getThemeColors(theme);
        return css`
      color: ${colors.propertyName};
      font-weight: 600;
    `;
    }}
`;

// String values
export const StringValue = styled.span`
  ${({ theme }) => {
        const colors = getThemeColors(theme);
        return css`
      color: ${colors.stringValue};
    `;
    }}
`;

// Numeric values
export const NumberValue = styled.span`
  ${({ theme }) => {
        const colors = getThemeColors(theme);
        return css`
      color: ${colors.numberValue};
    `;
    }}
`;

// Keywords, operators and language constructs (true, false, null)
export const KeywordValue = styled.span`
  ${({ theme }) => {
        const colors = getThemeColors(theme);
        return css`
      color: ${colors.keywordValue};
      font-weight: bold;
    `;
    }}
`;

// Comments
export const CommentValue = styled.span`
  ${({ theme }) => {
        const colors = getThemeColors(theme);
        return css`
      color: ${colors.commentValue};
      font-style: italic;
    `;
    }}
`;

// Data types
export const TypeValue = styled.span`
  ${({ theme }) => {
        const colors = getThemeColors(theme);
        return css`
      color: ${colors.typeValue};
    `;
    }}
`;

// Styled pre element for code blocks that exactly matches GitHub styling
export const CodePre = styled.pre`
  ${({ theme }) => {
        const colors = getThemeColors(theme);
        return css`
      margin: 0;
      white-space: pre-wrap;
      font-family: ${theme.typography.fonts.family.code};
      font-size: 0.875rem;
      line-height: 1.5;
      background-color: ${colors.background};
      color: ${colors.text};
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid ${colors.border};
      
      /* Ensure line spacing is consistent */
      & > div {
        min-height: 1.5em;
      }
      
      /* Add extra spacing for empty lines */
      & > div:empty:before {
        content: "\\00a0"; /* Non-breaking space to preserve empty lines */
        display: inline-block;
      }
    `;
    }}
`;

/**
 * Enhanced JSON formatter with GitHub-like syntax highlighting
 */
export const jsonFormatter: LanguageFormatter = {
    format: (code: string): React.ReactNode => {
        try {
            // Parse the JSON and re-format it with proper indentation
            const parsedJSON = JSON.parse(code);
            const formattedJSON = JSON.stringify(parsedJSON, null, 2);

            // Split the code into lines for line-by-line processing
            const lines = formattedJSON.split('\n');
            const outputLines: React.ReactElement[] = [];

            // Process each line
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Handle empty lines
                if (line.trim() === '') {
                    outputLines.push(
                        React.createElement('div', { key: `line-${i}` }, '\u00A0') // Non-breaking space to preserve the line
                    );
                    continue;
                }

                const parts: React.ReactNode[] = [];

                // Process property names (e.g. "propertyName":)
                const propertyRegex = /"([^"]+)":/g;
                let propMatch: RegExpExecArray | null;
                let lastIndex = 0;

                while ((propMatch = propertyRegex.exec(line)) !== null) {
                    // Add any text before the property
                    if (propMatch.index > lastIndex) {
                        parts.push(line.substring(lastIndex, propMatch.index));
                    }

                    // Add the property name with styling - GitHub style has quotes in the default color
                    // and only highlights the name itself
                    const fullMatch = propMatch[0]; // e.g. "name":
                    const propName = propMatch[1]; // e.g. name

                    // Create property name with styled inner text
                    parts.push('"');
                    parts.push(
                        React.createElement(
                            PropertyName,
                            { key: `prop-${i}-${propMatch.index}` },
                            propName
                        )
                    );
                    parts.push('":');

                    lastIndex = propMatch.index + fullMatch.length;
                }

                // Process the rest of the line
                if (lastIndex < line.length) {
                    const restOfLine = line.substring(lastIndex);
                    const restParts: React.ReactNode[] = [];
                    let restLastIndex = 0;

                    // Process string values
                    const stringRegex = / "([^"\\]|\\.)*"/g;
                    let stringMatch: RegExpExecArray | null;

                    while ((stringMatch = stringRegex.exec(restOfLine)) !== null) {
                        // Add any text before the string
                        if (stringMatch.index > restLastIndex) {
                            restParts.push(restOfLine.substring(restLastIndex, stringMatch.index));
                        }

                        // Add the string with styling
                        const stringElement = React.createElement(
                            StringValue,
                            { key: `str-${i}-${stringMatch.index}` },
                            stringMatch[0]
                        );
                        restParts.push(stringElement);

                        restLastIndex = stringMatch.index + stringMatch[0].length;
                    }

                    // Process numbers
                    const numberRegex = /\b\d+(\.\d+)?([eE][+-]?\d+)?\b/g;
                    let numMatch: RegExpExecArray | null;
                    let numParts: React.ReactNode[] = [];
                    let numLastIndex = 0;

                    const remainingText = restLastIndex < restOfLine.length
                        ? restOfLine.substring(restLastIndex)
                        : '';

                    while ((numMatch = numberRegex.exec(remainingText)) !== null) {
                        // Add any text before the number
                        if (numMatch.index > numLastIndex) {
                            numParts.push(remainingText.substring(numLastIndex, numMatch.index));
                        }

                        // Add the number with styling
                        const numElement = React.createElement(
                            NumberValue,
                            { key: `num-${i}-${numMatch.index}` },
                            numMatch[0]
                        );
                        numParts.push(numElement);

                        numLastIndex = numMatch.index + numMatch[0].length;
                    }

                    // Process keywords (true, false, null)
                    if (numLastIndex < remainingText.length) {
                        const keywordText = remainingText.substring(numLastIndex);
                        const keywordRegex = /\b(true|false|null)\b/g;
                        let keywordMatch: RegExpExecArray | null;
                        let keywordParts: React.ReactNode[] = [];
                        let keywordLastIndex = 0;

                        while ((keywordMatch = keywordRegex.exec(keywordText)) !== null) {
                            // Add any text before the keyword
                            if (keywordMatch.index > keywordLastIndex) {
                                keywordParts.push(keywordText.substring(keywordLastIndex, keywordMatch.index));
                            }

                            // Add the keyword with styling
                            const keywordElement = React.createElement(
                                KeywordValue,
                                { key: `key-${i}-${keywordMatch.index}` },
                                keywordMatch[0]
                            );
                            keywordParts.push(keywordElement);

                            keywordLastIndex = keywordMatch.index + keywordMatch[0].length;
                        }

                        // Add any remaining text
                        if (keywordLastIndex < keywordText.length) {
                            keywordParts.push(keywordText.substring(keywordLastIndex));
                        }

                        // Add keyword parts to numParts if they exist
                        if (keywordParts.length > 0) {
                            numParts.push(...keywordParts);
                        }
                    }

                    // Add any remaining text
                    if (numLastIndex < remainingText.length && numParts.length === 0) {
                        numParts.push(remainingText.substring(numLastIndex));
                    }

                    // Add numParts to restParts if they exist
                    if (numParts.length > 0) {
                        restParts.push(...numParts);
                    }

                    // Add restParts to main parts array if they exist
                    if (restParts.length > 0) {
                        parts.push(...restParts);
                    }
                }

                // Create a div for this line
                outputLines.push(
                    React.createElement('div', { key: `line-${i}` }, parts.length > 0 ? parts : line)
                );
            }

            // Combine all lines into the final output
            return React.createElement(CodePre, null, outputLines);
        } catch (error) {
            // Return the original code if parsing fails
            return React.createElement(CodePre, null, code);
        }
    }
};

/**
 * Enhanced Protobuf formatter with syntax highlighting
 */
export const protobufFormatter: LanguageFormatter = {
    format: (code: string): React.ReactNode => {
        // Split the code into lines for line-by-line processing
        const lines = code.split('\n');
        const outputLines: React.ReactElement[] = [];

        // Define protobuf language elements with GitHub-like highlighting
        const keywords = [
            'syntax', 'package', 'import', 'option', 'message', 'enum', 'service',
            'rpc', 'returns', 'stream', 'oneof', 'reserved', 'extend', 'extensions',
            'repeated', 'map', 'Config', 'map', 'string', 'MerchantConfig', 'BillConfig'
        ];

        const types = [
            'double', 'float', 'int32', 'int64', 'uint32', 'uint64',
            'sint32', 'sint64', 'fixed32', 'fixed64', 'sfixed32',
            'sfixed64', 'bool', 'string', 'bytes'
        ];

        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Handle empty lines
            if (line.trim() === '') {
                outputLines.push(
                    React.createElement('div', { key: `line-${i}` }, '\u00A0') // Non-breaking space to preserve the line
                );
                continue;
            }

            const parts: MatchedPart[] = [];

            // Process comments first
            const commentMatch = line.match(/(\/\/.*$)|(\/\*[\s\S]*?\*\/)/);
            let lineWithoutComment = line;

            if (commentMatch && commentMatch.index !== undefined) {
                // Add text before comment
                if (commentMatch.index > 0) {
                    lineWithoutComment = line.substring(0, commentMatch.index);
                    // We'll process this part for other syntax highlighting
                } else {
                    lineWithoutComment = "";
                }

                // Add the comment at the end
                const commentElement = React.createElement(
                    CommentValue,
                    { key: `comment-${i}` },
                    commentMatch[0]
                );
                parts.push({ index: commentMatch.index, element: commentElement });
            }

            // Process the rest of the line (excluding comments)
            if (lineWithoutComment.length > 0) {
                // Process keywords
                for (const keyword of keywords) {
                    const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'g');
                    let match: RegExpExecArray | null;

                    while ((match = keywordRegex.exec(lineWithoutComment)) !== null) {
                        const keywordElement = React.createElement(
                            KeywordValue,
                            { key: `keyword-${i}-${match.index}` },
                            match[0]
                        );
                        parts.push({
                            index: match.index,
                            element: keywordElement,
                            length: match[0].length
                        });
                    }
                }

                // Process = and ; symbols with regular text color
                const operatorRegex = /[=;]/g;
                let operatorMatch: RegExpExecArray | null;

                while ((operatorMatch = operatorRegex.exec(lineWithoutComment)) !== null) {
                    // Use regular text for operators (no special highlighting)
                    parts.push({
                        index: operatorMatch.index,
                        element: React.createElement('span', { key: `op-${i}-${operatorMatch.index}` }, operatorMatch[0]),
                        length: operatorMatch[0].length
                    });
                }

                // Process types
                for (const type of types) {
                    const typeRegex = new RegExp(`\\b${type}\\b`, 'g');
                    let match: RegExpExecArray | null;

                    while ((match = typeRegex.exec(lineWithoutComment)) !== null) {
                        const typeElement = React.createElement(
                            TypeValue,
                            { key: `type-${i}-${match.index}` },
                            match[0]
                        );
                        parts.push({
                            index: match.index,
                            element: typeElement,
                            length: match[0].length
                        });
                    }
                }

                // Process string literals
                const stringRegex = /"([^"\\]|\\.)*"/g;
                let stringMatch: RegExpExecArray | null;

                while ((stringMatch = stringRegex.exec(lineWithoutComment)) !== null) {
                    const stringElement = React.createElement(
                        StringValue,
                        { key: `string-${i}-${stringMatch.index}` },
                        stringMatch[0]
                    );
                    parts.push({
                        index: stringMatch.index,
                        element: stringElement,
                        length: stringMatch[0].length
                    });
                }

                // Process numbers
                const numberRegex = /\b\d+\b/g;
                let numberMatch: RegExpExecArray | null;

                while ((numberMatch = numberRegex.exec(lineWithoutComment)) !== null) {
                    const numberElement = React.createElement(
                        NumberValue,
                        { key: `number-${i}-${numberMatch.index}` },
                        numberMatch[0]
                    );
                    parts.push({
                        index: numberMatch.index,
                        element: numberElement,
                        length: numberMatch[0].length
                    });
                }
            }

            // Sort all parts by their index
            parts.sort((a, b) => a.index - b.index);

            // Build the final line with highlighted parts
            const finalLineParts: React.ReactNode[] = [];
            let lastIndex = 0;

            for (const part of parts) {
                // Add any plain text before this part
                if (part.index > lastIndex) {
                    finalLineParts.push(line.substring(lastIndex, part.index));
                }

                // Add the highlighted part
                finalLineParts.push(part.element);

                // Update lastIndex - use part.length if available, otherwise calculate it safely
                if (part.length) {
                    lastIndex = part.index + part.length;
                } else if (part.element.props && part.element.props.children) {
                    // If it's a string, use its length
                    if (typeof part.element.props.children === 'string') {
                        lastIndex = part.index + part.element.props.children.length;
                    } else {
                        // Otherwise, just use 1 as a fallback
                        lastIndex = part.index + 1;
                    }
                } else {
                    lastIndex = part.index + 1;
                }
            }

            // Add any remaining text
            if (lastIndex < line.length) {
                finalLineParts.push(line.substring(lastIndex));
            }

            // Create a div for this line
            outputLines.push(
                React.createElement('div', { key: `line-${i}` }, finalLineParts)
            );
        }

        // Combine all lines into the final output
        return React.createElement(CodePre, null, outputLines);
    }
};

/**
 * Registry of formatters
 */
export const formatters: Record<SupportedLanguages, LanguageFormatter> = {
    json: jsonFormatter,
    protobuf: protobufFormatter
}; 