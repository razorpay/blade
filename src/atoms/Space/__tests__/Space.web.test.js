import React from 'react';
import Text from '../../Text';
import Space from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('Renders <Space /> correctly', () => {
  it('should apply padding to child component', () => {
    const displayText = 'Hello';
    const { container } = renderWithTheme(
      <Space padding={[1, 2]}>
        <Text _isUnderlined>{displayText}</Text>
      </Space>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should apply margin to child component', () => {
    const displayText = 'Hello';
    const { container } = renderWithTheme(
      <Space margin={[5, 5]}>
        <Text _weight="bold">{displayText}</Text>
      </Space>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should throw error when more than one nodes are passed as children', () => {
    const expectedErrorMessage = 'Expected a single child for Space component';
    const displayText = 'Hello';
    expect(() =>
      renderWithTheme(
        <Space margin={[5, 5]}>
          <Text as="span">{displayText}</Text>
          <Text as="span">{displayText}</Text>
        </Space>,
      ),
    ).toThrow(expectedErrorMessage);
  });
});
