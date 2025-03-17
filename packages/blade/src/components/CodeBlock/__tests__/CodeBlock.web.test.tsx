import React from 'react';
import { _CodeBlock as CodeBlock } from '../CodeBlock';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import 'jest-styled-components';

// Mock Prism.js
jest.mock('prismjs', () => ({
    highlightElement: jest.fn(),
    plugins: {
        lineNumbers: {
            init: jest.fn(),
        },
    },
}));

describe('<CodeBlock />', () => {
    const jsonExample = `{
    "name": "John Doe",
    "age": 30,
    "isActive": true
  }`;

    it('should render JSON code correctly', () => {
        const { container } = renderWithTheme(
            <CodeBlock lang="json">{jsonExample}</CodeBlock>,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render without line numbers', () => {
        const { container } = renderWithTheme(
            <CodeBlock lang="json" showLineNumbers={false}>{jsonExample}</CodeBlock>,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render without background', () => {
        const { container } = renderWithTheme(
            <CodeBlock lang="json" showBackground={false}>{jsonExample}</CodeBlock>,
        );
        expect(container).toMatchSnapshot();
    });

    it('should apply testID correctly', () => {
        const testID = 'test-code-block';
        const { getByTestId } = renderWithTheme(
            <CodeBlock lang="json" testID={testID}>{jsonExample}</CodeBlock>,
        );
        expect(getByTestId(testID)).toBeInTheDocument();
    });
}); 