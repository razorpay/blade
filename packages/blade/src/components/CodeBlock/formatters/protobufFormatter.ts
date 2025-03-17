import React from 'react';
import { LanguageFormatter } from './types';
import { CommentValue, KeywordValue, TypeValue } from './components';

/**
 * Formatter for Protobuf syntax highlighting
 */
export const ProtobufFormatter: LanguageFormatter = {
    format: (protobuf: string): React.ReactNode => {
        // Split by newlines and format each line
        return protobuf.split('\n').map((line, lineIndex) => {
            const parts: React.ReactNode[] = [];
            let currentLine = line;

            // Handle comments (both // and /* */)
            const commentRegex = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/;
            const commentMatch = currentLine.match(commentRegex);

            if (commentMatch && commentMatch.index !== undefined) {
                // Add any text before the comment
                if (commentMatch.index > 0) {
                    parts.push(currentLine.substring(0, commentMatch.index));
                }

                // Add the comment with styling
                parts.push(
                    React.createElement(
                        CommentValue,
                        { key: `comment-${lineIndex}` },
                        commentMatch[0]
                    )
                );

                // Remove the comment from further processing
                currentLine = currentLine.substring(0, commentMatch.index);
            }

            // Handle keywords (syntax, message, service, rpc, returns, etc.)
            const keywords = [
                'syntax', 'package', 'import', 'option', 'message', 'enum', 'service',
                'rpc', 'returns', 'stream', 'oneof', 'reserved', 'extend', 'extensions'
            ];
            const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');

            let keywordMatch: RegExpExecArray | null;
            let lastKeywordIndex = 0;

            while ((keywordMatch = keywordRegex.exec(currentLine)) !== null) {
                // Add any text before the keyword
                if (keywordMatch.index > lastKeywordIndex) {
                    parts.push(currentLine.substring(lastKeywordIndex, keywordMatch.index));
                }

                // Add the keyword with styling
                parts.push(
                    React.createElement(
                        KeywordValue,
                        { key: `keyword-${lineIndex}-${parts.length}` },
                        keywordMatch[0]
                    )
                );

                lastKeywordIndex = keywordMatch.index + keywordMatch[0].length;
            }

            // Add any remaining text after the last keyword
            if (lastKeywordIndex < currentLine.length) {
                const remainingText = currentLine.substring(lastKeywordIndex);

                // Handle types (int32, string, bool, etc.)
                const types = [
                    'double', 'float', 'int32', 'int64', 'uint32', 'uint64',
                    'sint32', 'sint64', 'fixed32', 'fixed64', 'sfixed32',
                    'sfixed64', 'bool', 'string', 'bytes', 'map'
                ];
                const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');

                let typeMatch: RegExpExecArray | null;
                let lastTypeIndex = 0;
                let typeParts: React.ReactNode[] = [];

                while ((typeMatch = typeRegex.exec(remainingText)) !== null) {
                    // Add any text before the type
                    if (typeMatch.index > lastTypeIndex) {
                        typeParts.push(remainingText.substring(lastTypeIndex, typeMatch.index));
                    }

                    // Add the type with styling
                    typeParts.push(
                        React.createElement(
                            TypeValue,
                            { key: `type-${lineIndex}-${typeParts.length}` },
                            typeMatch[0]
                        )
                    );

                    lastTypeIndex = typeMatch.index + typeMatch[0].length;
                }

                // Add any remaining text after the last type
                if (lastTypeIndex < remainingText.length) {
                    typeParts.push(remainingText.substring(lastTypeIndex));
                }

                // Add the processed type parts to the main parts array
                parts.push(...typeParts);
            }

            return React.createElement(
                'div',
                { key: `line-${lineIndex}` },
                parts.length > 0 ? parts : line
            );
        });
    }
}; 