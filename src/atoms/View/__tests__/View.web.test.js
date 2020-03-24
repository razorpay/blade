import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Text from '../../Text';
import View from '../index';

describe('<View />', () => {
  describe('as', () => {
    it('renders View as div', () => {
      const { container } = renderWithTheme(
        <View as="div">
          <Text>{'simple div'}</Text>
        </View>,
      );
      expect(container).toMatchSnapshot();
    });
    it('renders View as span', () => {
      const { container } = renderWithTheme(
        <View as="span">
          <Text>{'simple span'}</Text>
        </View>,
      );
      expect(container).toMatchSnapshot();
    });
    it('renders View as p', () => {
      const { container } = renderWithTheme(
        <View as="p">
          <Text>{'simple p'}</Text>
        </View>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
