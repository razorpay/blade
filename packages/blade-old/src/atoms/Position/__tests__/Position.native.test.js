import React from 'react';
import { render } from '@testing-library/react-native';
import View from '../../View';
import Position from '../index';

describe('<Position />', () => {
  describe('renders', () => {
    it('should render component with default props', () => {
      const { container } = render(
        <Position>
          <View />
        </Position>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should apply specified props to child component', () => {
      const { container } = render(
        <Position position="absolute" top={2} right={2} bottom={2} left={2} zIndex={2}>
          <View />
        </Position>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('error', () => {
    beforeEach(() => jest.spyOn(console, 'error').mockImplementation());
    afterEach(() => jest.restoreAllMocks());

    it('should throw error when more than one nodes are passed as children', () => {
      const expectedErrorMessage = 'Expected a single child for Position component';
      expect(() =>
        render(
          <Position>
            <View />
            <View />
          </Position>,
        ),
      ).toThrow(expectedErrorMessage);
    });
  });
});
