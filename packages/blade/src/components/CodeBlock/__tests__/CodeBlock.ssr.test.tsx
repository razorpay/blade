/**
 * @jest-environment node
 */
import React from 'react';
import { _CodeBlock as CodeBlock } from '../CodeBlock';
import renderWithSSR from '~utils/testing/renderWithSSR';

// Mock Prism.js
jest.mock('prismjs', () => ({
    highlightElement: jest.fn(),
    plugins: {
        lineNumbers: {
            init: jest.fn(),
        },
    },
}));

describe('<CodeBlock /> SSR', () => {
    const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true
}`;

    it('should render without crashing on server', () => {
        const { container } = renderWithSSR(
            <CodeBlock lang="json">{jsonExample}</CodeBlock>,
        );
        expect(container).toMatchSnapshot();
    });
}); 