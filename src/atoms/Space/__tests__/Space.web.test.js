import React from 'react';
import View from '../../View';
import Space from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('Renders <Space /> correctly', () => {
  describe('with view component.', () => {
    it('should apply padding to child component', () => {
      const displayText = 'Flex Item';
      const { container } = renderWithTheme(
        <Space padding={[1, 2]}>
          <View>{displayText}</View>
        </Space>,
      );
      expect(container).toMatchSnapshot();
    });
    it('should apply margin to child component', () => {
      const displayText = 'Flex Item';
      const { container } = renderWithTheme(
        <Space margin={[5, 5]}>
          <View>{displayText}</View>
        </Space>,
      );
      expect(container).toMatchSnapshot();
    });
    it('should throw error when more than one nodes are passed as children', () => {
      const expectedErrorMessage = 'Expected a single child for Space component';
      expect(() =>
        renderWithTheme(
          <Space margin={[5, 5]}>
            <View />
            <View />
          </Space>,
        ),
      ).toThrow(expectedErrorMessage);
    });
  });
});
