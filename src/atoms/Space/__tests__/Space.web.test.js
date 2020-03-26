import React from 'react';
import View from '../../View';
import Space from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Space />', () => {
  describe('padding', () => {
    it('renders child component with Padding.', () => {
      const displayText = 'Flex Item';
      const { container } = renderWithTheme(
        <Space padding={[1, 2]}>
          <View>{displayText}</View>
        </Space>,
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe('margin', () => {
    it('renders child component with Margin.', () => {
      const displayText = 'Flex Item';
      const { container } = renderWithTheme(
        <Space margin={[5, 5]}>
          <View>{displayText}</View>
        </Space>,
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe('error', () => {
    it('throws error when more than one nodes are passed as children', () => {
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
