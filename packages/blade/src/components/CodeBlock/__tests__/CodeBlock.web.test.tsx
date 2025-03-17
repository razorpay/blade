import React from 'react';
import { CodeBlock } from '../CodeBlock';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import 'jest-styled-components';

describe('<CodeBlock />', () => {
    it('should render CodeBlock with default properties', () => {
        const { container } = renderWithTheme(<CodeBlock>{`{"test": "json"}`}</CodeBlock>);
        expect(container).toMatchSnapshot();
    });

    it('should render CodeBlock without background', () => {
        const { container } = renderWithTheme(
            <CodeBlock showBackground={false}>{`{"test": "json"}`}</CodeBlock>,
        );
        expect(container).toMatchSnapshot();
    });

    it('should handle invalid JSON gracefully', () => {
        const { container } = renderWithTheme(<CodeBlock>This is not valid JSON</CodeBlock>);
        expect(container).toMatchSnapshot();
    });
}); 