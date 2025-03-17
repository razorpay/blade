import styled from 'styled-components';

/**
 * Styled components for syntax highlighting
 * These components are used by the various language formatters
 */

// Property names and keys
export const PropertyName = styled.span`
    color: ${(props) => props.theme.colors.interactive.text.primary.normal};
`;

// String values
export const StringValue = styled.span`
    color: ${(props) => props.theme.colors.feedback.text.positive.intense};
`;

// Numeric values
export const NumberValue = styled.span`
    color: ${(props) => props.theme.colors.feedback.text.negative.intense};
`;

// Keywords, operators and language constructs
export const KeywordValue = styled.span`
    color: ${(props) => props.theme.colors.feedback.text.notice.intense};
`;

// Comments
export const CommentValue = styled.span`
    color: ${(props) => props.theme.colors.surface.text.gray.muted};
    font-style: italic;
`;

// Data types
export const TypeValue = styled.span`
    color: ${(props) => props.theme.colors.interactive.text.primary.subtle};
`; 