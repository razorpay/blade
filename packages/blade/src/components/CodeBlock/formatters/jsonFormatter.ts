import React from 'react';
import { LanguageFormatter } from './types';
import { PropertyName, StringValue, NumberValue, KeywordValue } from './components';

// Define interfaces for regex matches
interface TypedMatch {
    type: 'string' | 'number' | 'keyword';
    match: RegExpMatchArray;
}

/**
 * Formatter for JSON syntax highlighting
 */
export const JsonFormatter: LanguageFormatter = {
    format: (json: string): React.ReactNode => {
        try {
            // Parse and reformat with proper indentation
            const parsedJSON = JSON.parse(json);
            const formattedJSON = JSON.stringify(parsedJSON, null, 2);

            // Split by newlines and format each line
            return formattedJSON.split('\n').map((line, lineIndex) => {
                const parts: React.ReactNode[] = [];
                let remainingLine = line;

                // Find property names (e.g., "name":)
                const propertyNameRegex = /"([^"]+)":/g;
                let match: RegExpExecArray | null;
                let lastIndex = 0;

                while ((match = propertyNameRegex.exec(line)) !== null) {
                    // Add any text before the match
                    if (match.index > lastIndex) {
                        parts.push(line.substring(lastIndex, match.index));
                    }

                    // Add the property name with styling
                    parts.push(
                        React.createElement(
                            PropertyName,
                            { key: `prop-${lineIndex}-${parts.length}` },
                            match[0]
                        )
                    );

                    lastIndex = match.index + match[0].length;
                }

                // Add any remaining text
                if (lastIndex < line.length) {
                    remainingLine = line.substring(lastIndex);
                } else {
                    remainingLine = '';
                }

                // Process the rest of the line for other values
                if (remainingLine) {
                    // Find string values
                    const stringValueRegex = / "([^"]+)"/g;
                    const stringMatches = [...remainingLine.matchAll(stringValueRegex)];

                    // Find number values
                    const numberValueRegex = / ([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/g;
                    const numberMatches = [...remainingLine.matchAll(numberValueRegex)];

                    // Find boolean/null values
                    const keywordValueRegex = / (true|false|null)(?=[,}\]\\]|$)/g;
                    const keywordMatches = [...remainingLine.matchAll(keywordValueRegex)];

                    // Combine all matches and sort by index
                    const allMatches: TypedMatch[] = [
                        ...stringMatches.map(m => ({ type: 'string' as const, match: m })),
                        ...numberMatches.map(m => ({ type: 'number' as const, match: m })),
                        ...keywordMatches.map(m => ({ type: 'keyword' as const, match: m }))
                    ].sort((a, b) => {
                        // Safely handle possibly undefined indices
                        const aIndex = a.match.index !== undefined ? a.match.index : 0;
                        const bIndex = b.match.index !== undefined ? b.match.index : 0;
                        return aIndex - bIndex;
                    });

                    let currentIndex = 0;

                    // Process each match in order
                    for (const { type, match } of allMatches) {
                        // Safely handle possibly undefined index
                        const matchIndex = match.index !== undefined ? match.index : 0;

                        if (matchIndex > currentIndex) {
                            parts.push(remainingLine.substring(currentIndex, matchIndex));
                        }

                        if (type === 'string') {
                            parts.push(
                                React.createElement(
                                    StringValue,
                                    { key: `str-${lineIndex}-${parts.length}` },
                                    match[0]
                                )
                            );
                        } else if (type === 'number') {
                            parts.push(
                                React.createElement(
                                    NumberValue,
                                    { key: `num-${lineIndex}-${parts.length}` },
                                    match[0]
                                )
                            );
                        } else if (type === 'keyword') {
                            parts.push(
                                React.createElement(
                                    KeywordValue,
                                    { key: `key-${lineIndex}-${parts.length}` },
                                    match[0]
                                )
                            );
                        }

                        currentIndex = matchIndex + match[0].length;
                    }

                    // Add any remaining text
                    if (currentIndex < remainingLine.length) {
                        parts.push(remainingLine.substring(currentIndex));
                    }
                }

                return React.createElement('div', { key: `line-${lineIndex}` }, parts);
            });
        } catch (error) {
            // Return the original string if it's not valid JSON
            return json;
        }
    }
}; 